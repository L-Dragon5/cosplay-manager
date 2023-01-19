<?php

namespace App\Models;

use App\Traits\AutoIncrementModel;
use App\Models\Scopes\UserIdScope;
use Jenssegers\Mongodb\Eloquent\Model;

class Tag extends Model
{
    use AutoIncrementModel;

    protected $fillable = [
        'user_id',
        'title',
        'parent_id',
    ];
    protected $keyType = 'int';
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
