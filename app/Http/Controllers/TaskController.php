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
        Log::info('Tâche supprimée : ', ['task' => $task]);
        
        // Trouver et supprimer les tâches dépendantes
        $dependentTasks = Task::where('dependencies', $id)->get();
        foreach ($dependentTasks as $dependentTask) {
            broadcast(new TaskDeleted($dependentTask))->toOthers();
            $dependentTask->delete();
        }

        broadcast(new TaskDeleted($task))->toOthers();
        // Supprimer la tâche principale
        $task->delete();

        return response()->json($task, 204);
    }


    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'required|string',
            'user_id' => 'nullable|exists:users,id',
        ]);

        // Mettre à jour la tâche
        $task->update($validated);


    broadcast(new TaskEdited($task))->toOthers();

        return response()->json($task, 200);
    }


}
