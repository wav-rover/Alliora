<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ListModel extends Model
{
    use HasFactory;

    protected $table = 'list_models';
    protected $fillable = ['title', 'project_id', 'position'];


    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
