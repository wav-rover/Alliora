<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use App\Events\MessageSent;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    // Récupère les messages d'un projet
    public function sendMessage(Request $request, $projectId)
{
    $user = Auth::user();

    // Valider les données
    $validated = $request->validate([
        'content' => 'required|string|max:255',
    ]);

    // Créer le message
    $message = Message::create([
        'user_id' => $user->id,
        'project_id' => $projectId,
        'content' => $validated['content'],
    ]);

    // Charger la relation 'user'
    $message->load('user');

    // Diffuser l'événement
    broadcast(new MessageSent($message, $projectId))->toOthers();

    return response()->json(['message' => $message]);
}
}
