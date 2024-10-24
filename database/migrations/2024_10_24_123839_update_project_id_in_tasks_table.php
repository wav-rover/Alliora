<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class UpdateProjectIdInTasksTable extends Migration
{
    public function up()
    {
        // Mettre à jour les enregistrements existants pour définir project_id
        DB::table('tasks')->update(['project_id' => 27]); // Remplace 1 par l'ID d'un projet valide
    }

    public function down()
    {
        // Optionnel : mettre à jour les enregistrements si tu veux annuler
        DB::table('tasks')->update(['project_id' => null]);
    }
}
