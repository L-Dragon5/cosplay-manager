<?php

namespace App\Models;

use App\Models\Scopes\UserIdScope;
use Illuminate\Support\Facades\Storage;
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

        static::retrieved(function (Series $series) {
            // If local image, add / for root directory
            if (filter_var($series->image, FILTER_VALIDATE_URL) === false) {
                $series->image_url = Storage::url($series->image);
            }
        });
    }

    public function characters()
    {
        return $this->hasMany(Character::class);
    }
}
