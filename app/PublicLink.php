<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PublicLink extends Model
{
	protected $table = 'user_public_links';
    protected $fillable = ['id', 'user_id'];
    protected $keyType = 'string';

    public $timestamps = false;
    public $incrementing = false;

    protected static function boot() {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->getKey()) {
                $model->setAttribute($model->getKeyName(), (string) Str::uuid());
            }
        });
    }
}
