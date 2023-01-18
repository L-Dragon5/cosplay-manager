<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;

class Character extends Model
{
    protected $fillable = [
        'user_id',
        'series_id',
        'name',
        'image',
    ];
    public $timestamps = false;
}
