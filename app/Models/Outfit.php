<?php

namespace App\Models;

use App\Models\Scopes\UserIdScope;
use Jenssegers\Mongodb\Eloquent\Model;

class Outfit extends Model
{
    protected $fillable = [
        'user_id',
        'character_id',
        'title',
        'images',
        'status',
        'obtained_on',
        'creator',
        'storage_location',
        'times_worn',
    ];

    protected static function booted()
    {
        static::addGlobalScope(new UserIdScope);
    }
}
