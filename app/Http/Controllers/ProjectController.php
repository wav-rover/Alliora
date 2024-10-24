<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Task;
use App\Events\NewTaskCreated;
use Pusher\Pusher;
use Illuminate\Support\Facades\Log;


class ProjectController extends Controller
{
    // Afficher la liste des projets
    public function index()
    {
        $user = Auth::user();

        // Fetch teams where the user is admin or member
        $teams = Team::whereHas('users', function ($query) use ($user) {
            $query->where('users.id', $user->id);
        })->get();

        $adminTeams = Team::whereHas('users', function ($query) use ($user) {
            $query->where('users.id', $user->id)->where('team_user.role', 'admin');
        })->get();

        // Fetch projects associated with the user's teams, with the team relationship loaded
        $teamProjects = Project::with('team') // Ensure 'team' relationship is loaded
            ->whereHas('team', function ($query) use ($user) {
                $query->whereHas('users', function ($query) use ($user) {
                    $query->where('users.id', $user->id);
                });
            })->get();

        // Fetch projects directly associated with the user via project_user, with the team relationship loaded
        $userProjects = Project::with('team') // Ensure 'team' relationship is loaded here as well
            ->whereHas('users', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            })->get();

        // Merge both collections (team-based projects and user-based projects) and remove duplicates
        $projects = $teamProjects->merge($userProjects)->unique('id');

        return inertia('ProjectsPage', [
            'adminTeams' => $adminTeams,
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
            // Create a new team if no team_id is provided
            $team = Team::create([
                'name' => $request->input('name') . ' Team',
            ]);
            $team->users()->attach($user->id, ['role' => 'admin']);
        } else {
            // Find the team by ID
            $team = Team::find($request->input('team_id'));

            // Check if the user has admin rights for the team
            if (!$team->users()->where('users.id', $user->id)->where('team_user.role', 'admin')->exists()) {
                return response()->json(['error' => 'You do not have permission to create a project for this team.'], 403);
            }
        }

        // Create the project and associate it with the selected or created team
        $project = Project::create([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'team_id' => $team->id,
        ]);

        // Associate the user (creator) with the project
        $project->users()->attach($user->id, ['role' => 'admin']);

        // Load the team relationship before returning the project
        $project->load('team');

        return response()->json($project, 201);  // Return the project with the team relationship loaded
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

        // Check if the user has admin rights for the team
        $user = Auth::user();
        $team = Team::find($request->input('team_id'));
        if (!$team->users()->where('users.id', $user->id)->where('team_user.role', 'admin')->exists()) {
            return response()->json(['error' => 'You do not have permission to update this project for this team.'], 403);
        }

        // Update the project with the validated data
        $project->update($validated);

        // Load the team relationship before returning the project
        $project->load('team');

        return response()->json([
            'message' => 'Projet mis à jour avec succès',
            'project' => $project
        ], 200);  // Return the updated project with the team relationship loaded
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);

        // Vérifie que l'utilisateur est administrateur de l'équipe associée au projet
        $user = Auth::user();
        $team = Team::find($project->team_id);

        if (!$team || !$team->users()->where('users.id', $user->id)->where('team_user.role', 'admin')->exists()) {
            return response()->json(['error' => 'You do not have permission to delete this project.'], 403);
        }

        try {
            $project->delete();
            return response()->json(['message' => 'Project deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error deleting project', 'error' => $e->getMessage()], 500);
        }
    }

    public function newTask(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'required|exists:projects,id', // Vérifie que le project_id est présent
        ]);

        $task = Task::create([
            'name' => $request->name,
            'description' => $request->description,
            'project_id' => $request->project_id, // Ajoute le project_id ici
        ]);

        // Diffusion de l'événement
        broadcast(new NewTaskCreated($task))->toOthers();

        return response()->json($task, 201);
    }

    public function attachTask(Request $request, $projectId)
    {
        $validated = $request->validate([
            'task_id' => 'required|exists:tasks,id',
        ]);

        $project = Project::findOrFail($projectId);
        $project->tasks()->attach($validated['task_id']);

        return response()->json(['message' => 'Tâche liée au projet avec succès']);
    }


    public function show($id)
{
    // Récupérer le projet avec l'équipe associée
    $project = Project::with(['team'])->findOrFail($id);

    // Vérifier si l'utilisateur est membre de l'équipe
    $user = Auth::user();
    $isMember = $project->team->users()->where('team_user.team_id', $project->team_id)
                                         ->where('users.id', $user->id)
                                         ->exists();

    // Si l'utilisateur n'est pas membre de l'équipe, rediriger ou renvoyer une erreur
    if (!$isMember) {
        abort(403, 'Accès non autorisé à ce projet.');
    }

    return inertia('ProjectShowPage', [
        'project' => $project,
        'tasks' => $project->tasks,
    ]);
}

}
