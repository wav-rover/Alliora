<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Auth;
use App\Models\Project;


Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('task.{projectId}', function ($user, $projectId) {
    // Vérifiez si l'utilisateur est authentifié
    if (Auth::check()) {
        // Trouvez le projet par son ID
        $project = Project::with('team.users')->find($projectId);

        // Vérifiez si le projet existe et si l'utilisateur est membre de l'équipe du projet
        if ($project && $project->team->users()->where('users.id', $user->id)->exists()) {
            return ['id' => $user->id, 'name' => $user->name];
        }
    }

    // Si l'utilisateur n'est pas membre de l'équipe ou n'est pas authentifié, ne pas retourner de valeur
    return null;
});