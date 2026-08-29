<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('architectures', function (Blueprint $table) {
            // Add new columns
            $table->unsignedBigInteger('views_count')->default(0)->after('is_public');
            $table->unsignedBigInteger('likes_count')->default(0)->after('views_count');
            $table->unsignedBigInteger('bookmarks_count')->default(0)->after('likes_count');
            $table->text('short_description')->nullable()->after('tech_stack');
            
            // Add index for better query performance
            $table->index('views_count');
            $table->index('likes_count');
        });
    }

    public function down(): void
    {
        Schema::table('architectures', function (Blueprint $table) {
            $table->dropColumn(['views_count', 'likes_count', 'bookmarks_count', 'short_description']);
            $table->dropIndex(['views_count', 'likes_count']);
        });
    }
};