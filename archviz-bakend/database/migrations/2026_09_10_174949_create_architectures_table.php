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
        Schema::create('architectures', function (Blueprint $table) {
            $table->id();

            // Relationships
            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->cascadeOnDelete();

            // Core Attributes
            $table->string('title');
            $table->text('prompt_input');
            $table->string('tech_stack')->nullable();

            // Structure Data
            $table->json('diagram_json');
            $table->json('tradeoffs_json')->nullable();

            // Sharing & Visibility Settings
            $table->string('share_slug')->unique();
            $table->boolean('is_public')->default(true)->index();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('architectures');
    }
};
