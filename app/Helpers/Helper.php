<?php

use Illuminate\Support\Facades\DB;
use Intervention\Image\Facades\Image;

/**
 * Strip special characters and lowercase string.
 */
if (!function_exists('strip_and_lower')) {
  /**
   * Strip unnecessary character and set to lowercase.
   * 
   * @param  string  $string
   * @return string
   */
  function strip_and_lower($string) {
    return strtolower(preg_replace('/[^a-zA-Z0-9-_\.]/', '', $string));
  }
}

/**
 * Return a json encoded message.
 */
if (!function_exists('return_json_message')) {
  /**
   * Return Laravel Response that is JSON encoded with data
   * 
   * @param  string  $message
   * @param  string  $statusCode
   * @param  array  $extraArray
   * @return \Illuminate\Http\Response
   */
  function return_json_message($message, $statusCode, $extraArray = null) {
    $return = ['message' => $message];
    
    if (!empty($extraArray)) {
      $return = array_merge($return, $extraArray);
    }
    
    return response()->json($return, $statusCode);
  }
}

/**
 * Check for duplicate entry.
 */
if (!function_exists('check_for_duplicate')) {
  /**
   * Check for duplicate title in database table.
   * 
   * @param  int  $user_id
   * @param  string  $title
   * @param  string  $db_table
   * @param  string  $column_name
   * @return bool
   */
  function check_for_duplicate($user_id, $title, $db_table, $column_name) {
    $t = trim(strip_and_lower($title));
    $entries = DB::table($db_table)->where('user_id', $user_id)->pluck($column_name);

    foreach ($entries as $entry) {
      if ($t === strip_and_lower($entry)) {
        return true;
      }
    }

    return false;
  }
}

/**
 * Save image from uploaded.
 */
if (!function_exists('save_image_uploaded')) {
  /**
   * Save image from file uploaded.
   * 
   * @param  string  $url
   * @param  string  $location
   * @param  int  $height
   * @param  string  $old_image_path
   * @return string
   */
  function save_image_uploaded($file, $location, $height, $old_image_path = null) {
    // Create directory if it doesn't exist
    if (!file_exists(storage_path("app/public/$location/"))) {
      mkdir(storage_path("app/public/$location/"), 666, true);
    }

    // Get filenames
    $filename_with_ext = $file->getClientOriginalName();
    $filename = pathinfo($filename_with_ext, PATHINFO_FILENAME);
    $extension = $file->getClientOriginalExtension();
    $filename_to_store = $filename . '_' . time() . '.' . $extension;

    // Create image, resize, and save
    $img = Image::make($file)->resize(null, $height, function ($constraint) {
        $constraint->aspectRatio();
    });
    $img->save(storage_path("app/public/$location/$filename_to_store"), 80);

    // Remove old image if set
    if (!empty($old_image_path)) {
      // Check if using placeholder image
      if ($old_image_path !== '200x400.png') {
        $full_path = storage_path('app/public/' . $old_image_path);

        if (file_exists($full_path)) {
          unlink($full_path);
        }
      }
    }

    // Return image storage path
    return "$location/$filename_to_store";
  }
}

/**
 * Save image from URL.
 */
if (!function_exists('save_image_url')) {
  /**
   * Save image from remote URL.
   * 
   * @param  string  $url
   * @param  string  $location
   * @param  int  $height
   * @param  string  $old_image_path
   * @return string
   */
  function save_image_url($url, $location, $height, $old_image_path = null) {
    // Create directory if it doesn't exist
    if (!file_exists(storage_path("app/public/$location/"))) {
      mkdir(storage_path("app/public/$location/"), 666, true);
    }

    // Get filenames
    $filename = pathinfo($url, PATHINFO_FILENAME);
    $extension = pathinfo(parse_url($url, PHP_URL_PATH), PATHINFO_EXTENSION);
    $filename_to_store = $filename . '_' . time() . '.' . $extension;

    // Create image, resize, and save
    $img = Image::make(file_get_contents($url))->resize(null, $height, function ($constraint) {
        $constraint->aspectRatio();
    });
    $img->save(storage_path("app/public/$location/$filename_to_store"), 80);

    // Remove old image if set
    if (!empty($old_image_path)) {
      // Check if using placeholder image
      if ($old_image_path !== '200x400.png') {
        $full_path = storage_path('app/public/' . $old_image_path);

        if (file_exists($full_path)) {
          unlink($full_path);
        }
      }
    }

    // Return image storage path
    return "$location/$filename_to_store";
  }
}
