<?php
namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    

    public function destroy($id)
    {
        $task = Task::findOrFail($id);

        // Supprimer la tâche
        $task->delete();

        return response()->json(null, 204);
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

        return response()->json($task, 200);
    }


}
