<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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
			$images = DB::select('SELECT image_url FROM items');

			// Break out of script if no images to grab
			if(count($images) < 1) {
				return;
			}

			foreach($images as $image) {
				$url = $image->image_url;
				if(filter_var($url, FILTER_VALIDATE_URL) === FALSE) {
					continue;
				}

				// Timeout for 3s for getting image
        try {
          $arContext['http']['timeout'] = 3;
          $context = stream_context_create($arContext);
          $img = file_get_contents($url, 0, $context);

          if(!empty($img)) {
            $im = imagecreatefromstring($img);
            $width = imagesx($im);
            $height = imagesy($im);
            $newwidth = '400';
            $newheight = (($height * $newwidth) / $width);
            $thumb = imagecreatetruecolor($newwidth, $newheight);
            imagecopyresized($thumb, $im, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);

            $fileName = 'thumbs/' . microtime() . '.jpg';
            $storageName = 'storage/app/public/' . $fileName;
            $linkName = 'storage/' . $fileName;
            imagejpeg($thumb, $storageName);
            imagedestroy($thumb);
            imagedestroy($im);

            DB::update('UPDATE items SET image_url=? WHERE image_url=?', [$linkName, $url]);
          }
        } catch (Exception $e) {
				  $this->error($e);
        }

			}
    }
}
