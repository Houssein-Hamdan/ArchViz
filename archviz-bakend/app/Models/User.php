<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    //Architecture of User
    public function architectures(): HasMany
    {
        return $this->hasMany(Architecture::class);
    }

    //Liked Architecture
    public function likedArchitectures(): BelongsToMany
    {
        return $this->belongsToMany(
            Architecture::class,
            'architecture_likes',
            'user_id',
            'architecture_id'
        )->withTimestamps();
    }

    //Bookmarked Architecture
    public function bookmarkedArchitectures(): BelongsToMany
    {
        return $this->belongsToMany(
            Architecture::class,
            'bookmarks',
            'user_id',
            'architecture_id'
        )->withTimestamps();
    }
}