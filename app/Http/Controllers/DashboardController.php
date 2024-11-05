<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use App\Models\Team;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Fetch recent projects associated with the user
        $recentProjects = Project::with('team')
            ->whereHas('users', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            })
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Fetch upcoming tasks associated with the user
        $upcomingTasks = Task::with('project')
            ->whereHas('project.users', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            })
            ->where('due_date', '>=', now())
            ->orderBy('due_date', 'asc')
            ->take(5)
            ->get();

        $teamProjects = Project::with('team') // Ensure 'team' relationship is loaded
            ->whereHas('team', function ($query) use ($user) {
                $query->whereHas('users', function ($query) use ($user) {
                    $query->where('users.id', $user->id);
                });
            })->get();

            $tasks = Task::with('project')
            ->whereHas('project.users', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            })
            ->get();

        // Fetch projects directly associated with the user via project_user, with the team relationship loaded
        $userProjects = Project::with('team') // Ensure 'team' relationship is loaded here as well
            ->whereHas('users', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            })->get();

        $projects = $teamProjects->merge($userProjects)->unique('id');

        return inertia('Dashboard', [
            'recentProjects' => $recentProjects,
            'upcomingTasks' => $upcomingTasks,
            'projects' => $projects,
            'tasks'=> $tasks
        ]);
    }
}
