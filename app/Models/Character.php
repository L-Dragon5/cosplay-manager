<?php

namespace App\Models;

use App\Models\Scopes\UserIdScope;
use Illuminate\Support\Facades\Storage;
use Jenssegers\Mongodb\Eloquent\Model;

class Character extends Model
{
    protected $fillable = [
        'user_id',
        'series_id',
        'name',
        'image',
    ];
    public $timestamps = false;

    protected static function booted()
    {
        static::addGlobalScope(new UserIdScope);

        static::retreived(fn (Character $character) => $character->image_url = Storage::url($character->image)
        );
    }

    public function outfits()
    {
        return $this->hasMany(Outfit::class, 'character_id');
    }
}
