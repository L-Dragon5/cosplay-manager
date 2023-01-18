<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;

class Series extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'image',
    ];
    public $timestamps = false;
}
