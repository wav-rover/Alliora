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
        'user_id',
        'dependencies', // ID de la tâche dont dépend cette tâche
    ];

    // Relation avec l'utilisateur
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relation avec le projet
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function list()
    {
        return $this->belongsTo(ListModel::class);
    }
}
