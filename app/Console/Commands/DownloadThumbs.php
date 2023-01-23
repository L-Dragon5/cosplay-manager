<?php

namespace App\Console\Commands;

use App\Models\Item;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class DownloadThumbs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'thumbs:download';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Replace all links in database with downloaded thumbnails';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        // Get all image urls
        $items = Item::where('image_url', 'LIKE', '%alicdn%')->get();

        // Break out of script if no images to grab
        if (count($items) < 1) {
            return;
        }

        echo 'Items found to edit: ' . count($items) . PHP_EOL;
        foreach ($items as $item) {
            $url = $item->image_url;
            echo 'Current item id: ' . $item->_id . PHP_EOL;

            $context = stream_context_create(['http' => ['timeout' => 10]]);
            $file = file_get_contents('https:'.$url, false, $context);
            if (!empty($file)) {
                $img = Image::make($file)->resize(400, null, function ($constraint) {
                    $constraint->aspectRatio();
                })->encode('jpg', 100);
                $uuid = substr(bin2hex(random_bytes(ceil(26 / 2))), 0, 26);
                $location = 'thumbs/' . $uuid . '.jpg';
                $status = Storage::put($location, $img);
                if ($status) {
                    $item->image_url = $location;
                    $item->save();
                }
            }
        }
    }
}
