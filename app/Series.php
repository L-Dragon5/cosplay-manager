<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Series extends Model
{
    protected $fillable = [
        'user_id', 'title', 'image'
    ];

    public $timestamps = false;
}
