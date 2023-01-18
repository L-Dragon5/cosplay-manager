<?php

namespace App\Models;

use App\Models\Scopes\UserIdScope;
use Jenssegers\Mongodb\Eloquent\Model;

class Item extends Model
{
    protected $table = 'items';
    protected $fillable = [
        'user_id',
        'tag_id',
        'image_url',
        'original_title',
        'custom_title',
        'seller_name',
        'listing_url',
        'notes',
        'quantity',
        'original_price',
        'is_archived',
        'archived_at',
    ];

    protected static function booted()
    {
        static::addGlobalScope(new UserIdScope);
    }
}
