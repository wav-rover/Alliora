<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class UpdateProjectIdInTasksTable extends Migration
{
    public function up()
    {
        // Mettre à jour les enregistrements existants pour définir project_id
        DB::table('tasks')->update(['project_id' => 27]);
    }

    public function down()
    {
        DB::table('tasks')->update(['project_id' => null]);
    }
}
