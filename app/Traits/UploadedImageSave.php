<?php

namespace App\Traits;

use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

trait UploadedImageSave
{
    /**
     * Save image from file uploaded.
     *
     * @param  string|array  $file
     * @param  string  $location
     * @param  int  $height
     * @param  string  $old_image_path
     * @return string
     */
    public function saveUploadedImage($file, $location, $height, $old_image_path = null): string
    {
        // Set return value
        $return_path = '';

        // Check for multiple images
        if (is_array($file)) {
            foreach ($file as $img) {
                // If Base64 String image
                if (is_string($img)) {
                    [$extension, $img] = explode(';', $img);
                    [, $img] = explode(',', $img);

                    $extension = substr($extension, 11);
                    $filename_to_store = bin2hex(random_bytes(5)) . '_' . time() . '.' . $extension;
                } else {
                    // Get filenames
                    $filename_with_ext = $img->getClientOriginalName();
                    $filename = pathinfo($filename_with_ext, PATHINFO_FILENAME);
                    $extension = $img->getClientOriginalExtension();
                    $filename_to_store = $filename . '_' . time() . '.' . $extension;
                }

                // Create image, resize, and save
                $final_img = Image::make($img)->resize(null, $height, function ($constraint) {
                    $constraint->aspectRatio();
                })->encode('jpg', 90);
                Storage::put("$location/$filename_to_store", $final_img);

                // Add delimiter for outfit images
                if ($location === 'outfit') {
                    $return_path .= "||$location/$filename_to_store";
                } else {
                    $return_path = "$location/$filename_to_store";
                }
            }
        } else {
            // If Base64 String Image
            if (is_string($file)) {
                [$extension, $file] = explode(';', $file);
                [, $file] = explode(',', $file);

                $extension = substr($extension, 11);
                $filename_to_store = bin2hex(random_bytes(5)) . '_' . time() . '.' . $extension;
            } else {
                // Get filenames
                $filename_with_ext = $file->getClientOriginalName();
                $filename = pathinfo($filename_with_ext, PATHINFO_FILENAME);
                $extension = $file->getClientOriginalExtension();
                $filename_to_store = $filename . '_' . time() . '.' . $extension;
            }

            // Create image, resize, and save
            $img = Image::make($file)->resize(null, $height, function ($constraint) {
                $constraint->aspectRatio();
            })->encode('jpg', 80);
            Storage::put("$location/$filename_to_store", $img);

            // Add delimiter for outfit images
            if ($location === 'outfit') {
                $return_path .= "||$location/$filename_to_store";
            } else {
                $return_path = "$location/$filename_to_store";
            }

            // Check if editing image path
            if (!empty($old_image_path)) {
                // Different actions for different locations
                if ($location === 'series') {
                    // Remove if not using placeholder image
                    if ($old_image_path !== '300x200.png') {
                        if (Storage::exists($old_image_path)) {
                            Storage::delete($old_image_path);
                        }
                    }
                } elseif ($location === 'character') {
                    // Remove if not using placeholder image
                    if ($old_image_path !== '200x400.png') {
                        if (Storage::exists($old_image_path)) {
                            Storage::delete($old_image_path);
                        }
                    }
                } elseif ($location === 'outfit') {
                    // Remove placeholder path if it exists and add new image paths
                    $return_path = str_replace('||300x400.png', '', $old_image_path) . $return_path;
                }
            }
        }

        // Return image storage path
        return $return_path;
    }

    /**
     * Save image from remote URL.
     *
     * @param  string  $url
     * @param  string  $location
     * @param  int  $height
     * @param  string  $old_image_path
     * @return string
     */
    public function saveUrlImage($url, $location, $height, $old_image_path = null): string
    {
        // Set return value
        $return_path = '';

        // Get filenames
        $filename = pathinfo($url, PATHINFO_FILENAME);
        $extension = pathinfo(parse_url($url, PHP_URL_PATH), PATHINFO_EXTENSION);
        $filename_to_store = $filename . '_' . time() . '.' . $extension;

        // Create image, resize, and save
        $img = Image::make(file_get_contents($url))->resize(null, $height, function ($constraint) {
            $constraint->aspectRatio();
        })->encode('jpg', 80);
        Storage::put("$location/$filename_to_store", $img);

        // Add delimiter for outfit images
        if ($location === 'outfit') {
            $return_path = "||$location/$filename_to_store";
        } else {
            $return_path = "$location/$filename_to_store";
        }

        // Check if editing image path
        if (!empty($old_image_path)) {
            // Different actions for different locations
            if ($location === 'series') {
                // Remove if not using placeholder image
                if ($old_image_path !== '300x200.png') {
                    if (Storage::exists($old_image_path)) {
                        Storage::delete($old_image_path);
                    }
                }
            } elseif ($location === 'character') {
                // Remove if not using placeholder image
                if ($old_image_path !== '200x400.png') {
                    if (Storage::exists($old_image_path)) {
                        Storage::delete($old_image_path);
                    }
                }
            } elseif ($location === 'outfit') {
                // Remove placeholder path if it exists and add new image paths
                $return_path = str_replace('||300x400.png', '', $old_image_path) . $return_path;
            }
        }

        // Return image storage path
        return $return_path;
    }
}
