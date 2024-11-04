<?php

namespace App\Http\Controllers;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Récupérer les IDs des équipes auxquelles appartient l'utilisateur
        $teamIds = $user->teams->pluck('id');

        // 5 derniers projets associés aux équipes de l'utilisateur
        $recentProjects = Project::whereIn('team_id', $teamIds)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Tâches à venir pour les projets dans les équipes de l'utilisateur
        $upcomingTasks = Task::whereIn('project_id', $recentProjects->pluck('id'))
            ->where('start_date', '>', now())
            ->orderBy('start_date', 'asc')
            ->get();

        return inertia('Dashboard', [
            'recentProjects' => $recentProjects,
            'upcomingTasks' => $upcomingTasks,
            'projectCount' => $recentProjects->count(),
        ]);
    }
}

