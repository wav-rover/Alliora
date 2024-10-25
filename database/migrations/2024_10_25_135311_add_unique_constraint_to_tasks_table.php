<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUniqueConstraintToTasksTable extends Migration
{
    public function up()
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Supprimez toute contrainte d'unicité sur la colonne 'positi
            // Ajoute une contrainte d'unicité combinée
            $table->unique(['position', 'list_id']); // Unique par liste
        });
    }

    public function down()
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropUnique(['position', 'list_id']); // Supprime la contrainte d'unicité combinée
            // Si besoin, vous pouvez également restaurer l'unicité sur 'position'
            $table->unique('position'); // Rétablit l'unicité sur la position seule
        });
    }
}
