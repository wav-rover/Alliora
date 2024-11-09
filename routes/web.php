<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ListController;
use Illuminate\Support\Facades\Broadcast;

Broadcast::routes(['middleware' => ['auth:api']]);

Route::post('/broadcasting/auth', 'BroadcastController@authenticate');

Route::get('/', function () {
    return Inertia::render('HomePage', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('csrf')->name('logout');

Route::middleware('auth')->group(function () {
    Route::get('/profile/{id}', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/users', [ProfileController::class, 'index'])->name('users.index'); // Add this line

});


// Routes des équipes
Route::middleware('auth')->group(function () {
    Route::post('/projects/{projectId}', [ChatController::class, 'sendMessage']);

    Route::get('/teams', [TeamController::class, 'index'])->name('teams.index');
    Route::post('/teams', [TeamController::class, 'store'])->name('teams.store');
    Route::put('/teams/{id}', [TeamController::class, 'update'])->name('teams.update');
    Route::delete('/teams/{id}', [TeamController::class, 'destroy'])->name('teams.destroy');
    Route::get('/teams/{id}/users', [TeamController::class, 'getUsers'])->name('teams.getUsers');
    Route::put('/teams/{team}/promote/{user}', [TeamController::class, 'promoteMember']);
    Route::put('/teams/{team}/demote/{user}', [TeamController::class, 'demoteMember']);
    Route::delete('/teams/{team}/remove/{user}', [TeamController::class, 'removeMember']);
    Route::post('/teams/{teamId}/leave', [TeamController::class, 'leaveTeam']);
    Route::post('/teams/join/{team_code}', [TeamController::class, 'joinTeam']);

    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::get('/projects/{id}', [ProjectController::class, 'show'])->name('projects.show');
    Route::put('/projects/{id}', [ProjectController::class, 'update'])->name('projects.update');
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy'])->name('projects.destroy');


    // Gestion des listes liées aux projets
    Route::post('/lists', [ListController::class, 'store'])->name('lists.store');
    Route::put('/lists/{id}', [ListController::class, 'update'])->name('lists.update');
    Route::delete('/lists/{id}', [ListController::class, 'destroy'])->name('lists.destroy');
    Route::put('/lists', [ListController::class, 'updatePositions']);

    Route::put('/tasks', [TaskController::class, 'updateTaskPositions']);


    // Gestion des tâches liées aux projets
    Route::post('/projects/{id}/tasks', [ProjectController::class, 'attachTask'])->name('projects.attachTask');
    Route::delete('/projects/{id}/tasks', [ProjectController::class, 'detachTask'])->name('projects.detachTask');

    // Routes des tâches
    Route::get('/tasks', [TaskController::class, 'index'])->name('tasks.index');
    Route::post('/tasks', [ProjectController::class, 'newTask'])->name('tasks.store');
    Route::get('/tasks/{id}', [TaskController::class, 'show'])->name('tasks.show');
    Route::put('/tasks/{id}', [TaskController::class, 'update'])->name('tasks.update');
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy'])->name('tasks.destroy');
});

require __DIR__ . '/auth.php';
