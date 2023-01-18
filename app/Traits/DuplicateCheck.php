<?php

namespace App\Traits;

trait DuplicateCheck
{
    /**
     * Check current service's assigned class for duplicates.
     *
     * @param  int  $userId
     * @param  string  $search
     * @param  string  $column
     * @return  bool
     */
    public function checkForDuplicate($userId, $search, $column): bool
    {
        $currentClass = static::class;
        $currentClass = str_replace('Service', '', $currentClass);

        return $currentClass::where('user_id', $userId)->where($column, '=', $search)->exists();
    }
}
