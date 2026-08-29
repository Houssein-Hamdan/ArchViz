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
        Schema::create('architecture_likes', function (Blueprint $table) {
            $table->id();
            
            // Foreign key referencing the users table with cascade delete
            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();
                
            // Foreign key referencing the architectures table with cascade delete
            $table->foreignId('architecture_id')
                ->constrained('architectures')
                ->cascadeOnDelete();
                
            $table->timestamps();
            
            // Prevent duplicate likes per user for the same architecture
            $table->unique(['user_id', 'architecture_id']);
            
            // Index to optimize lookup performance by architecture
            $table->index('architecture_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('architecture_likes');
    }
};