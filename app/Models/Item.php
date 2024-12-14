<?php

namespace App\Models;

use App\Models\Scopes\UserIdScope;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Model;

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

    protected function images(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes) {
                $images = explode('||', $attributes['image_url']);
                $image_paths = [];

                foreach ($images as $image) {
                    // If local image, add / for root directory
                    if (str_contains($image, 'thumbs')) {
                        $image_paths[] = Storage::url($image);
                    } else {
                        $image_paths[] = $image;
                    }
                }

                return $image_paths;
            }
        );
    }

    protected static function booted()
    {
        static::addGlobalScope(new UserIdScope);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, null, 'item_id', 'tag_id');
    }
}
