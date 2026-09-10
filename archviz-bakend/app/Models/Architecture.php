<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Architecture extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'prompt_input',
        'tech_stack',
        'short_description',
        'diagram_json',
        'tradeoffs_json',
        'share_slug',
        'is_public',
        'views_count',
        'likes_count',
        'bookmarks_count',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'diagram_json' => 'array',
            'tradeoffs_json' => 'array',
            'is_public' => 'boolean',
        ];
    }

    
    //Get the user that created the architecture diagram.
    
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    
    // The users that have liked this architecture.
     
    public function likes(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            'architecture_likes',
            'architecture_id',
            'user_id'
        )->withTimestamps();
    }

    
    //The users that have bookmarked this architecture.
     
    public function bookmarks(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            'bookmarks',
            'architecture_id',
            'user_id'
        )->withTimestamps();
    }

    
    // Determine if the architecture has been liked by the given user.
    
    public function isLikedBy(User $user): bool
    {
        return $this->likes()->where('user_id', $user->id)->exists();
    }

    
    // Determine if the architecture has been bookmarked by the given user.
     
    public function isBookmarkedBy(User $user): bool
    {
        return $this->bookmarks()->where('user_id', $user->id)->exists();
    }

    
    //Increment the views count for this architecture model.
     
    public function incrementViews(): void
    {
        $this->increment('views_count');
    }
}