<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Jenssegers\Mongodb\Auth\User as Authenticatable;
use App\Traits\AutoIncrementModel;

class User extends Authenticatable
{
    use Notifiable, AutoIncrementModel;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'email',
        'password',
    ];

    protected $keyType = 'int';
}
