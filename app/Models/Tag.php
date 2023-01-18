<?php

namespace App\Models;

use App\Models\Scopes\UserIdScope;
use Jenssegers\Mongodb\Eloquent\Model;

class Tag extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'parent_id',
    ];
    public $timestamps = false;

    protected static function booted()
    {
        static::addGlobalScope(new UserIdScope);
    }

    public function items()
    {
        return $this->belongsToMany(Item::class, 'items_tags');
    }

    public function outfits()
    {
        return $this->belongsToMany(Outfit::class, 'outfits_tags');
    }
}
