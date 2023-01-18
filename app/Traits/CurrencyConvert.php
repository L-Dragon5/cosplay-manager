<?php

namespace App\Traits;

trait CurrencyConvert
{
    /**
     * Convert currency amount from Chinese Yuan to USD (rudimentary).
     *
     * @param  string  $amount
     * @return  string  $priceString
     */
    public function convertCurrency($amount): string
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
