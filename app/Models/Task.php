<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'project_id',
    ];

    // Relation avec l'utilisateur
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function project()
{
    return $this->belongsTo(Project::class);
}


    // Gérer la dépendance des tâches
    public function dependency()
    {
        return $this->belongsTo(Task::class, 'dependencies');
    }
}
