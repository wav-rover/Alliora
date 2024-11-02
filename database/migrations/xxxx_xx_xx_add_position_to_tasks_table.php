public function up()
{
    Schema::table('tasks', function (Blueprint $table) {
        $table->integer('position')->nullable();
    });
}

public function down()
{
    Schema::table('tasks', function (Blueprint $table) {
        $table->dropColumn('position');
    });
}
