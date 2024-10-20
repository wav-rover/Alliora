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
    Schema::create('projects', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->text('description')->nullable();
        $table->date('start_date')->nullable();
        $table->date('end_date')->nullable();
        $table->string('status')->default('pending'); // Statut du projet
        $table->foreignId('team_id')->constrained('teams')->onDelete('cascade'); // Liaison avec la table teams
        $table->timestamps();
    });
}

public function down()
{
    Schema::dropIfExists('projects');
}
};
