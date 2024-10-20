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
    Schema::create('teams', function (Blueprint $table) {
        $table->id();
        $table->string('name');  // Nom de l'équipe
        $table->timestamps();
    });
}

public function down()
{
    Schema::dropIfExists('teams');
}

};
