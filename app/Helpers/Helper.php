<?php

use Illuminate\Support\Facades\DB;

/**
 * Strip special characters and lowercase string.
 */
if (!function_exists('strip_and_lower')) {
  function strip_and_lower($string) {
    return strtolower(preg_replace('/[^a-zA-Z0-9-_\.]/', '',$string));
  }
}

/**
 * Return a json encoded message.
 */
if (!function_exists('return_json_message')) {
  function return_json_message($message, $statusCode) {
    return response()->json(['message' => $message], $statusCode);
  }
}

/**
 * Check for duplicate entry.
 */
if (!function_exists('check_for_duplicate')) {
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
