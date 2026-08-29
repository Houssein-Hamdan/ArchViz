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
        Schema::create('bookmarks', function (Blueprint $table) {
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
            
            // Ensure a user can only bookmark a unique architecture once
            $table->unique(['user_id', 'architecture_id']);
            
            // Index to speed up relational filtering by architecture
            $table->index('architecture_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookmarks');
    }
};