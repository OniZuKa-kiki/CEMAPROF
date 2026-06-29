<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contact_messages', function (Blueprint $table) {
            $table->string('delivery_city')->nullable()->after('company');
            $table->string('delivery_mode')->nullable()->after('delivery_city');
            $table->string('delivery_notes', 500)->nullable()->after('delivery_mode');
        });
    }

    public function down(): void
    {
        Schema::table('contact_messages', function (Blueprint $table) {
            $table->dropColumn(['delivery_city', 'delivery_mode', 'delivery_notes']);
        });
    }
};
