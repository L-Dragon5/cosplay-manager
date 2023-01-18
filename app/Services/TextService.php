<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class TextService
{
    /**
     * Strip unnecessary character and set to lowercase.
     *
     * @param  string  $string
     * @return string
     */
    public static function strip_and_lower($string)
    {
        return strtolower(preg_replace('/[^a-zA-Z0-9-_\.]/', '', $string));
    }

    /**
     * Check for duplicate title in database table.
     *
     * @param  int  $user_id
     * @param  string  $title
     * @param  string  $db_table
     * @param  string  $column_name
     * @return bool
     */
    public static function check_for_duplicate($user_id, $title, $db_table, $column_name)
    {
        $t = trim(self::strip_and_lower($title));
        $entries = DB::table($db_table)->where('user_id', $user_id)->pluck($column_name);

        foreach ($entries as $entry) {
            if ($t === self::strip_and_lower($entry)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Convert USD to CNY.
     */
    public function convert_currency($amount)
    {
        $origPrice = explode(' - ', $amount);
        $priceString = '';

        if (count($origPrice) == 1) {
            $priceString = '¥' . $origPrice[0] . 'CNY ($' . number_format(round($origPrice[0] * .16), 2) . 'USD)';
        } elseif (count($origPrice) == 2) {
            $priceString = '¥' . $origPrice[0] . ' - ¥' . $origPrice[1] . 'CNY ($' . number_format(round($origPrice[0] * .16), 2) . ' - $' . number_format(round($origPrice[1] * .16), 2) . 'USD)';
        } else {
            $priceString = 'Error';
        }

        return $priceString;
    }
}
