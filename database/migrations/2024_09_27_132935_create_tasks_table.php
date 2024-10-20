<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('tasks', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->text('description')->nullable();
        $table->date('start_date')->nullable();
        $table->date('end_date')->nullable();
        $table->string('status')->default('pending'); // Statut de la tâche (ex: "en cours", "terminé", etc.)
        $table->foreignId('project_id')->constrained('projects')->onDelete('cascade'); // Liaison avec la table projects
        $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null'); // L'utilisateur assigné à la tâche
        $table->unsignedBigInteger('dependencies')->nullable(); // Si la tâche dépend d'une autre tâche
        $table->timestamps();
    });
}

public function down()
{
    Schema::dropIfExists('tasks');
}

};
