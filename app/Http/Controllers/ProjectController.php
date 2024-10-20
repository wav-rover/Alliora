<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Team;
use App\Models\User;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProjectController extends Controller
{
    // Afficher la liste des projets
    public function index()
{
    $user = Auth::user();

    // Récupérer les équipes où l'utilisateur est admin
    $teams = Team::whereHas('users', function($query) use ($user) {
        $query->where('users.id', $user->id)
              ->where('team_user.role', 'admin');
    })->get();

    // Récupérer les projets
    $projects = Project::all(); // Ou appliquez une condition si nécessaire

    return inertia('ProjectsPage', [
        'teams' => $teams,
        'projects' => $projects, // Ajoutez les projets ici
    ]);
}


    // Créer un nouveau projet
    public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'required|string',
        'team_id' => 'nullable|exists:teams,id', // Vérifiez si l'ID d'équipe est valide
    ]);

    // Si aucune équipe n'est sélectionnée, créer une nouvelle équipe
    if (!$request->input('team_id')) {
        $team = Team::create([
            'name' => $request->input('name') . ' Team', // Nom de l'équipe basée sur le projet
        ]);
        // Ajouter le créateur comme membre
        $team->users()->attach(Auth::user()->id, ['role' => 'admin']);
    } else {
        $team = Team::find($request->input('team_id'));
    }

    // Créer le projet
    $project = Project::create([
        'name' => $request->input('name'),
        'description' => $request->input('description'),
        'team_id' => $team->id, // Associer le projet à l'équipe
    ]);

    return response()->json($project); // Retourne le projet créé
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
