<?php
namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\TaskEdited;
use App\Events\TaskDeleted;
use App\Events\TasksUpdated;
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

    public function updateTaskPositions(Request $request)
    {
        // Récupérer les nouvelles données des tâches depuis la requête
        $tasks = $request->input('tasks');
        $updatedTasks = [];
    
        // Parcourir chaque tâche pour mettre à jour sa position et sa liste
        foreach ($tasks as $taskData) {
            $task = Task::find($taskData['id']);
            if ($task) {
                $task->list_id = $taskData['list_id'];
                $task->position = $taskData['position'];
                $task->save();
                $updatedTasks[] = $task;
            }
        }
    
        // Diffuse un tableau de tâches via l'événement
        broadcast(new TasksUpdated($updatedTasks))->toOthers();
    
        return response()->json(['message' => 'Positions updated successfully'], 200);
    }
    


    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $validated = $request->validate([
            'name' => 'string|max:255',
            'description' => 'nullable|string',
            'position' => 'integer',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'string',
            'user_id' => 'nullable|exists:users,id',
        ]);

        // Mettre à jour la tâche
        $task->update($validated);


    broadcast(new TaskEdited($task))->toOthers();

        return response()->json($task, 200);
    }


}
