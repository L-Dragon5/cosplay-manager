<?php

namespace App\Models;

use App\Models\Scopes\UserIdScope;
use Illuminate\Support\Facades\Storage;
use Jenssegers\Mongodb\Eloquent\Model;

class Item extends Model
{
    protected $table = 'items';
    protected $fillable = [
        'user_id',
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

        static::retrieved(function (Item $item) {
            // If local image, add / for root directory
            if (!str_contains('thumbs', $item->image_url)) {
                $item->image_url = Storage::url($item->image_url);
            }
        });
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, null, 'item_ids', 'tag_ids');
    }
}
