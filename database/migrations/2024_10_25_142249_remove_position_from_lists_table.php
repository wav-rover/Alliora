<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('lists', function (Blueprint $table) {
            $table->dropUnique(['position']);
            
            $table->dropColumn('position');
        });
    }

    public function down()
    {
        Schema::table('lists', function (Blueprint $table) {
            $table->integer('position')->unique()->nullable();
        });
    }
};
