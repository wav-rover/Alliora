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
    Schema::create('team_user', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        $table->foreignId('team_id')->constrained('teams')->onDelete('cascade');
        $table->string('role')->default('member');  // Rôle de l'utilisateur dans l'équipe
        $table->timestamps();
    });
}

public function down()
{
    Schema::dropIfExists('team_user');
}

};
