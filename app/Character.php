<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Character extends Model
{
    protected $fillable = [
        'user_id', 'series_id', 'name', 'image',
    ];
    public $timestamps = false;
}
