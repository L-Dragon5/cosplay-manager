<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    protected $fillable = [
        'user_id', 'title', 'parent_id'
    ];

    public $timestamps = false;
}
