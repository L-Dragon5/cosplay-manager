<?php

namespace App\Models;

use App\Models\Scopes\UserIdScope;
use Illuminate\Support\Facades\Storage;
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

        static::retreived(function (Outfit $outfit) {
            $images = explode('||', $outfit->images);
            array_shift($images);
            $images_urls = array_reduce($images, function ($carry, $item) {
                return [...$carry, Storage::url($item)];
            }, []);

            $outfit->images_urls = $images_urls;
        });
    }

    public function character()
    {
        return $this->belongsTo(Character::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'items_tags');
    }
}
