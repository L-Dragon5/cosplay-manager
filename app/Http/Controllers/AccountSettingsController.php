<?php

namespace App\Http\Controllers;

use App\Item;
use App\PublicLink;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AccountSettingsController extends Controller
{
    /**
     * Download CSV of Items from Taobao Organizer.
     *
     * @return StreamedResponse csv file
     */
    public function getCSV(Request $request)
    {
        // Get user ID
        $uid = Auth::user()->id;

        // Setup column names
        $columnNames = ['original_title', 'custom_title', 'seller_name', 'listing_url', 'notes', 'quantity', 'original_price'];

        // Get all items
        $rows = Item::where([['user_id', '=', $uid]])->get()->toArray();

        // Convert given array to something that works for CSV
        $items = [$columnNames];
        foreach ($rows as $item) {
            $temp = [];
            foreach ($item as $k => $v) {
                if (in_array($k, $columnNames)) {
                    $temp[] = $v;
                }
            }
            $items[] = $temp;
        }

        // Return as stream response to user
        return new StreamedResponse(function () use ($items) {
            //Open up a file pointer
            $fp = fopen('php://output', 'w');

            // Write BOM character sequence to fix UTF-8 in Excel
            fwrite($fp, $bom = chr(239) . chr(187) . chr(191));

            //Then, loop through the rows and write them to the CSV file.
            foreach ($items as $row) {
                fputcsv($fp, $row);
            }

            //Close the file pointer.
            fclose($fp);
        }, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename=tbo-export.csv',
        ]);
    }

    /**
     * Get public link to share cosplays.
     *
     * @return string link id
     */
    public function getPublicLink(Request $request)
    {
        // Get user ID
        $user_id = Auth::user()->id;

        // Check if public link exists
        try {
            $public_link = PublicLink::where('user_id', $user_id)->firstOrFail();

            return return_json_message($this->createPublicLinkUrl($public_link->id), self::STATUS_SUCCESS);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Public link was not found via UUID. Create one.
            $public_link = PublicLink::create([
                'user_id' => $user_id,
            ]);
            $success = $public_link->save();

            if ($success) {
                return return_json_message($this->createPublicLinkUrl($public_link->id), self::STATUS_SUCCESS);
            } else {
                return return_json_message('Something went wrong while creating link', self::UNPROCESSABLE);
            }
        }
    }

    private function createPublicLinkUrl($uuid)
    {
        if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
            $protocol = 'https';
        } else {
            $protocol = 'http';
        }

        return $protocol . '://' . $_SERVER['HTTP_HOST'] . '/s/' . $uuid;
    }
}
