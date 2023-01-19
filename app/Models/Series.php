<?php

namespace App\Models;

use App\Traits\AutoIncrementModel;
use App\Models\Scopes\UserIdScope;
use Illuminate\Support\Facades\Storage;
use Jenssegers\Mongodb\Eloquent\Model;

class Series extends Model
{
    use AutoIncrementModel;

    protected $fillable = [
        'user_id',
        'title',
        'image',
    ];
    protected $keyType = 'int';
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
