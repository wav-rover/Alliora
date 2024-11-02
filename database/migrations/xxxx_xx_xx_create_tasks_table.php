public function up()
{
    Schema::create('tasks', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->text('description')->nullable();
        $table->string('status');
        $table->date('start_date')->nullable();
        $table->date('end_date')->nullable();
        $table->integer('position')->nullable(); // Ensure this line exists
        $table->foreignId('project_id')->constrained()->onDelete('cascade');
        $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
        $table->foreignId('list_id')->constrained('list_models')->onDelete('cascade');
        $table->foreignId('dependencies')->nullable()->constrained('tasks')->onDelete('set null');
        $table->timestamps();
    });
}
