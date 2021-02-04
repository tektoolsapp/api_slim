<?php

namespace App\Models;

use Cartalyst\Sentinel\Users\EloquentUser;

class User extends EloquentUser
{
    protected $fillable = [
        'username',
        'email',
        'password',
        'last_name',
        'first_name',
        'last_name',
        'initials'
    ];

    protected $loginNames = ['username'];
}