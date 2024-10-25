<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateListsTable extends Migration
{
    public function up()
    {
        Schema::create('lists', function (Blueprint $table) {
            $table->id(); // Identifiant unique
            $table->string('title'); // Titre de la liste
            $table->integer('position')->unique(); // Position unique
            $table->foreignId('project_id')->constrained()->onDelete('cascade'); // Clé étrangère vers le projet
            $table->timestamps(); // Champs created_at et updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('lists');
    }
}

