<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    // Afficher la liste des projets
    public function index()
{
    $user = Auth::user();

    // Fetch teams where the user is admin or member
    $teams = Team::whereHas('users', function($query) use ($user) {
        $query->where('users.id', $user->id);
    })->get();

    // Fetch projects associated with the user's teams
    $teamProjects = Project::with('team')->whereHas('team', function($query) use ($user) {
        $query->whereHas('users', function($query) use ($user) {
            $query->where('users.id', $user->id);
        });
    })->get();

    // Fetch projects directly associated with the user via project_user
    $userProjects = Project::whereHas('users', function($query) use ($user) {
        $query->where('users.id', $user->id);
    })->get();

    // Merge both collections (team-based projects and user-based projects) and remove duplicates
    $projects = $teamProjects->merge($userProjects)->unique('id');

    return inertia('ProjectsPage', [
        'teams' => $teams,
        'projects' => $projects,
    ]);
}


public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'required|string',
        'team_id' => 'nullable|exists:teams,id',
    ]);

    $user = Auth::user();

    // Handle team creation or selection
    if (!$request->input('team_id')) {
        $team = Team::create([
            'name' => $request->input('name') . ' Team',
        ]);
        $team->users()->attach($user->id, ['role' => 'admin']);
    } else {
        $team = Team::find($request->input('team_id'));

        if (!$team->users()->where('users.id', $user->id)->where('team_user.role', 'admin')->exists()) {
            return response()->json(['error' => 'You do not have permission to create a project for this team.'], 403);
        }
    }

    // Create the project
    $project = Project::create([
        'name' => $request->input('name'),
        'description' => $request->input('description'),
        'team_id' => $team->id,
    ]);

    // Associate the creator (user) with the project in the project_user table
    $project->users()->attach($user->id, ['role' => 'admin']);

    return response()->json($project);
}



    // Afficher un projet spécifique
    public function show($id)
    {
        $project = Project::with('tasks')->findOrFail($id);
        return response()->json($project);
    }

    // Mettre à jour un projet
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'nullable|string|max:255',
            'team_id' => 'required|exists:teams,id',
        ]);

        $project = Project::findOrFail($id);
        $project->update($validated);

        return response()->json(['message' => 'Projet mis à jour avec succès', 'project' => $project]);
    }

    // Supprimer un projet
    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();

        return response()->json(['message' => 'Projet supprimé avec succès']);
    }

    // Attacher une tâche à un projet
    public function attachTask(Request $request, $projectId)
    {
        $validated = $request->validate([
            'task_id' => 'required|exists:tasks,id',
        ]);

        $project = Project::findOrFail($projectId);
        $project->tasks()->attach($validated['task_id']);

        return response()->json(['message' => 'Tâche liée au projet avec succès']);
    }

    // Détacher une tâche d'un projet
    public function detachTask(Request $request, $projectId)
    {
        $validated = $request->validate([
            'task_id' => 'required|exists:tasks,id',
        ]);

        $project = Project::findOrFail($projectId);
        $project->tasks()->detach($validated['task_id']);

        return response()->json(['message' => 'Tâche détachée du projet avec succès']);
    }

    // Liste des tâches liées à un projet
    public function listTasks($projectId)
    {
        $project = Project::with('tasks')->findOrFail($projectId);
        return response()->json($project->tasks);
    }
}