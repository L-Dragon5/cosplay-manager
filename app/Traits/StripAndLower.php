<?php

namespace App\Traits;

trait StripAndLower
{
    /**
     * Strip unnecessary character and set to lowercase.
     *
     * @param  string  $string
     * @return string
     */
    public static function stripAndLowerText($string): string
    {
        return strtolower(preg_replace('/[^a-zA-Z0-9-_\.]/', '', $string));
    }
}
