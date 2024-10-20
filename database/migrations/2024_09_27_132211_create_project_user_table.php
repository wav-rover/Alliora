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
    Schema::create('project_user', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Liaison avec la table users
        $table->foreignId('project_id')->constrained('projects')->onDelete('cascade'); // Liaison avec la table projects
        $table->string('role')->default('member'); // Rôle de l'utilisateur dans le projet (ex: "manager", "member", etc.)
        $table->timestamps();
    });
}

public function down()
{
    Schema::dropIfExists('project_user');
}

};
