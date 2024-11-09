<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Auth;
use App\Models\Project;
use Illuminate\Support\Facades\DB;


Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('task.{projectId}', function ($user, $projectId) {
    if (Auth::check()) {
        $project = Project::with('team.users')->find($projectId);

        if ($project && $project->team->users()->where('users.id', $user->id)->exists()) {
            return ['id' => $user->id, 'name' => $user->name];
        }
    }

    // Si l'utilisateur n'est pas membre de l'équipe ou n'est pas authentifié, ne pas retourner de valeur
    return null;
});

Broadcast::channel('presence.project.{projectId}', function ($user, $projectId) {
    $teamId = \App\Models\Project::findOrFail($projectId)->team_id;
    $role = DB::table('team_user')->where('team_id', $teamId)->where('user_id', $user->id)->value('role');

    return [
        'id' => $user->id,
        'name' => $user->name,
        'role' => $role, // Ajoute le rôle ici
    ];
});
