<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ListModel;
use App\Events\ListDeleted;
use App\Events\ListsUpdated;
use App\Events\ListCreated;
use App\Events\ListEdited;
use Illuminate\Support\Facades\Log;

class ListController extends Controller
{
    public function index()
    {
        $lists = ListModel::all();
        return response()->json($lists);
    }

    public function store(Request $request)
    {
        $maxPosition = ListModel::where('project_id', $request->project_id)->max('position');
        $newPosition = $maxPosition !== null ? $maxPosition + 1 : 0;

        $request->validate([
            'title' => 'required|string|max:255',
            'project_id' => 'required|integer',
            'position' => 'required|integer'
        ]);
        $list = new ListModel();
        $list->title = $request->title;
        $list->project_id = $request->project_id;
        $list->position = $newPosition;
        $list->save();
        broadcast(new ListCreated($list))->toOthers(); // Diffuser l'événement de création de la liste
        return response()->json($list, 201);
    }

// app/Http/Controllers/ListController.php
public function updatePositions(Request $request) {
    $lists = $request->lists;
    $updatedLists = [];

    foreach ($lists as $listData) {
        $list = ListModel::find($listData['id']);
        $list->update(['position' => $listData['position']]);
        $updatedLists[] = $list;
    }

    broadcast(new ListsUpdated($updatedLists))->toOthers();

    return response()->json(['message' => 'Positions mises à jour avec succès']);
}
    
    

    public function show($id)
    {
        $list = ListModel::findOrFail($id);
        return response()->json($list);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'string|max:255',
            'position' => 'integer'
        ]);

        $list = ListModel::findOrFail($id);
        $list->update($request->all());
        broadcast(new ListEdited($list))->toOthers(); // Diffuser l'événement de modification de la liste
        return response()->json($list);
    }

    public function destroy($id)
{
    $list = ListModel::findOrFail($id);
        $projectId = $list->project_id; // Récupérer l'ID du projet associé à la liste
        broadcast(new ListDeleted($list))->toOthers(); // Diffuser l'événement de suppression de la liste
        $list->delete();
        return response()->json(['message' => 'Liste supprimée avec succès']);
}


}