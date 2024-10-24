<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveColumnsFromTasksTable extends Migration
{
    public function up()
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Supprimer la colonne project_id
            $table->dropForeign(['project_id']); // Si la colonne a une clé étrangère
            $table->dropColumn('project_id'); // Supprimer la colonne
        });
    }

    public function down()
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade'); // Ajouter à nouveau si besoin
        });
    }
}

