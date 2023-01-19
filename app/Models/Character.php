<?php

namespace App\Models;

use App\Traits\AutoIncrementModel;
use App\Models\Scopes\UserIdScope;
use Illuminate\Support\Facades\Storage;
use Jenssegers\Mongodb\Eloquent\Model;

class Character extends Model
{
    use AutoIncrementModel;

    protected $fillable = [
        'user_id',
        'series_id',
        'name',
        'image',
    ];
    protected $keyType = 'int';
    public $timestamps = false;

    protected static function booted()
    {
        static::addGlobalScope(new UserIdScope);

        static::retrieved(fn (Character $character) => $character->image_url = Storage::url($character->image));
    }

    public function outfits()
    {
        return $this->hasMany(Outfit::class, 'character_id');
    }
}
