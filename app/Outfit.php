<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Outfit extends Model
{
    protected $fillable = [
        'user_id',
        'character_id',
        'title',
        'images',
        'status',
        'bought_date',
        'storage_location',
        'times_worn'
    ];
}
