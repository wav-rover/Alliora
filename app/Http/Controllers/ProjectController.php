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
use App\Events\UserConnected;


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

        $user = Auth::user();
        $team = Team::find($request->input('team_id'));
        if (!$team->users()->where('users.id', $user->id)->where('team_user.role', 'admin')->exists()) {
            return response()->json(['error' => 'You do not have permission to update this project for this team.'], 403);
        }

        $project->update($validated);

        $project->load('team');

        return response()->json([
            'message' => 'Projet mis à jour avec succès',
            'project' => $project
        ], 200);  
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);

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
        'status' => 'required|string|in:pending,in progress,finished', // Only accept these values
        'start_date' => 'nullable|date',
        'end_date' => 'nullable|date',
        'position' => 'integer',
        'project_id' => 'required|exists:projects,id',
        'user_id' => 'nullable|exists:users,id',
        'dependencies' => 'nullable|exists:tasks,id',
        'list_id' => 'required|exists:list_models,id',
    ]);

    $position = Task::where('list_id', $request->list_id)->count();

    $task = Task::create([
        'name' => $request->name,
        'description' => $request->description,
        'status' => $request->status, 
        'start_date' => $request->start_date,
        'end_date' => $request->end_date,
        'position' => $position,
        'project_id' => $request->project_id,
        'user_id' => $request->user_id,
        'dependencies' => $request->dependencies,
        'list_id' => $request->list_id,
    ]);

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
    $project = Project::with([
        'team',
        'lists' => function ($query) {
            $query->orderBy('position'); // Trier les listes par position
        },
        'team.users' => function ($query) {
            $query->select('users.id', 'users.name')
                ->addSelect('team_user.role'); // Sélectionner le rôle des utilisateurs
        }
    ])->findOrFail($id);

    $user = Auth::user();
    event(new UserConnected($user));

    // Vérifier si l'utilisateur est membre de l'équipe
    $isMember = $project->team->users()
        ->where('team_user.team_id', $project->team_id)
        ->where('users.id', $user->id)
        ->exists();

    if (!$isMember) {
        abort(403, 'Accès non autorisé à ce projet.');
    }

    return inertia('ProjectShowPage', [
        'project' => $project,
        'tasks' => $project->tasks,
        'lists' => $project->lists, // Les listes sont maintenant triées par position
        'users' => $project->team->users, // Transmet les utilisateurs avec le rôle
        'currentUserId' => $user->id, // Ajout de l'ID de l'utilisateur connecté
    ]);
}


}
