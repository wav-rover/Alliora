<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::dropIfExists('tasks'); // Supprime la table actuelle

    Schema::create('tasks', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->text('description')->nullable();
        $table->date('start_date')->nullable();
        $table->date('end_date')->nullable();
        $table->string('status')->default('pending');
        $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
        $table->foreignId('project_id')->constrained('projects');
        $table->integer('position')->nullable();
        $table->unsignedBigInteger('dependencies')->nullable();
        $table->foreignId('list_id')->nullable()->constrained('list_models')->onDelete('cascade');
        $table->timestamps();
    });
}

public function down()
{
    Schema::dropIfExists('tasks'); // Annule la recréation de la table
}

};
