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
        'status',
        'start_date',
        'end_date',
        'position',
        'project_id',
        'user_id',
        'list_id',
        'dependencies',
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
    return $this->belongsTo(ListModel::class, 'list_id', 'id');
}
}
