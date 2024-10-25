<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ListModel;
use App\Events\ListDeleted;
use App\Events\ListCreated;
use App\Events\ListEdited;

class ListController extends Controller
{
    public function index()
    {
        $lists = ListModel::all();
        return response()->json($lists);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'project_id' => 'required|integer',
        ]);
        
        $list = ListModel::create($request->all());
        broadcast(new ListCreated($list))->toOthers(); // Diffuser l'événement de création de la liste
        return response()->json($list, 201);
    }

    public function show($id)
    {
        $list = ListModel::findOrFail($id);
        return response()->json($list);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255'
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