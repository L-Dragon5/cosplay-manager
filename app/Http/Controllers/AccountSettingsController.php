<?php

namespace App\Http\Controllers;

use App\Item;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AccountSettingsController extends Controller
{
  /**
   * Download CSV of Items from Taobao Organizer.
   * 
   * @return StreamedResponse csv file
   */
  public function getCSV(Request $request) {
    // Get user ID
    $uid = Auth::user()->id;

    // Setup column names
    $columnNames = array('original_title', 'custom_title', 'seller_name', 'listing_url', 'notes', 'quantity', 'original_price');

    // Get all items
    $rows = Item::where([['user_id', '=', $uid]])->get()->toArray();

    // Convert given array to something that works for CSV
    $items = array($columnNames);
    foreach($rows as $item) {
      $temp = array();
      foreach($item as $k => $v) {
        if(in_array($k, $columnNames))
          $temp[] = $v;
      }
      $items[] = $temp;
    }

    // Return as stream response to user
    return new StreamedResponse(function() use ($items) {
      //Open up a file pointer
      $fp = fopen('php://output', 'w');

      // Write BOM character sequence to fix UTF-8 in Excel
      fputs( $fp, $bom = chr(0xEF) . chr(0xBB) . chr(0xBF) );

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
}
