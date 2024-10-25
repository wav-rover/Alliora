<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('lists', function (Blueprint $table) {
            // Supprimez d'abord l'index unique
            $table->dropUnique(['position']);
            
            // Puis supprimez la colonne `position`
            $table->dropColumn('position');
        });
    }

    public function down()
    {
        Schema::table('lists', function (Blueprint $table) {
            // Recréez la colonne `position` et l'index unique
            $table->integer('position')->unique()->nullable();
        });
    }
};
