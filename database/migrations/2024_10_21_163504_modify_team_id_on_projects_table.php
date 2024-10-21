<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyTeamIdOnProjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('projects', function (Blueprint $table) {
            // First, drop the current foreign key constraint
            $table->dropForeign(['team_id']);

            // Modify the team_id to allow null values if not already nullable
            $table->unsignedBigInteger('team_id')->nullable()->change();

            // Add the foreign key constraint back with 'onDelete('set null')'
            $table->foreign('team_id')->references('id')->on('teams')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('projects', function (Blueprint $table) {
            // Drop the modified foreign key
            $table->dropForeign(['team_id']);

            // Optionally, revert team_id to non-nullable if needed
            $table->unsignedBigInteger('team_id')->nullable(false)->change();

            // Add the original foreign key back with 'onDelete('cascade')'
            $table->foreign('team_id')->references('id')->on('teams')->onDelete('cascade');
        });
    }
}
