<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('otp_verifications', function (Blueprint $table) {
            $table->id();
            
            // Unique target email address (automatically creates a unique index)
            $table->string('email')->unique();
            
            // 6-digit verification code
            $table->string('otp');
            
            // Counter for tracking invalid verification attempts
            $table->integer('attempts')->default(0);
            
            // Expiration timestamp for OTP validity window
            $table->timestamp('expires_at');
            
            // Timestamp recording when the OTP was successfully verified
            $table->timestamp('verified_at')->nullable();
            
            // Temporary token used to authorize post-OTP multi-step completion
            $table->string('temp_token')->nullable();
            
            $table->timestamps();

            // Index to optimize lookup performance for expired records
            $table->index('expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('otp_verifications');
    }
};