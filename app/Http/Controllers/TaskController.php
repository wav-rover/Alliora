<?php
namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\TaskEdited;
use App\Events\TaskDeleted;
use Illuminate\Support\Facades\Log;

class TaskController extends Controller
{
    

    public function destroy($id)
{
    $task = Task::findOrFail($id);
    $projectId = $task->project_id;
    Log::info('Tâche supprimée : ', ['task' => $task]); // Log avant de diffuser l'événement
    broadcast(new TaskDeleted($task))->toOthers();
    
    // Supprimer la tâche
    $task->delete();

    return response()->json($task, 204);
}


    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            // Autres champs selon vos besoins
        ]);

        // Mettre à jour la tâche
        $task->update($validated);


    broadcast(new TaskEdited($task))->toOthers();

        return response()->json($task, 200);
    }


}
