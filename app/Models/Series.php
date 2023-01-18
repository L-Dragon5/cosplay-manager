<?php

namespace App\Models;

use App\Models\Scopes\UserIdScope;
use Jenssegers\Mongodb\Eloquent\Model;

class Series extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'image',
    ];
    public $timestamps = false;

    protected static function booted()
    {
        static::addGlobalScope(new UserIdScope);
    }
}
