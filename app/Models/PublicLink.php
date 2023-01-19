<?php

namespace App\Models;

use Illuminate\Support\Str;
use Jenssegers\Mongodb\Eloquent\Model;

class PublicLink extends Model
{
    protected $table = 'user_public_links';
    protected $fillable = ['_id', 'user_id'];
    protected $keyType = 'string';
    public $timestamps = false;
    public $incrementing = false;

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->getKey()) {
                $model->setAttribute($model->getKeyName(), (string) Str::uuid());
            }
        });
    }
}
