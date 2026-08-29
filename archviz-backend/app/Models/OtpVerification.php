<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OtpVerification extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'otp',
        'attempts',
        'expires_at',
        'verified_at',
        'temp_token',
    ];

    protected $dates = [
        'expires_at',
        'verified_at',
    ];

    
    // Check if OTP is still valid (not expired)
     
    public function isValid(): bool
    {
        return now()->lessThan($this->expires_at) && $this->verified_at === null;
    }

    
    // Check if OTP is already verified
     
    public function isVerified(): bool
    {
        return $this->verified_at !== null;
    }

    
     // Mark as verified
   
    public function markAsVerified(): void
    {
        $this->update(['verified_at' => now()]);
    }
}