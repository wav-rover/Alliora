<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Response;
use App\Http\Requests\ProfileUpdateRequest;


class ProfileController extends Controller
{
    // Méthode pour lister tous les utilisateurs
    public function index(Request $request)
    {
        // Récupérer tous les utilisateurs sauf l'utilisateur actuellement connecté
        $users = User::where('id', '!=', Auth::id())
                 ->select('id', 'name', 'img_profile', 'created_at') // Liste des colonnes à sélectionner
                 ->get();

        // Retourner les utilisateurs sous forme de JSON
        return response()->json($users);
    }

    
    public function edit(Request $request): \Inertia\Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    public function update(ProfileUpdateRequest $request)
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }
    

    // Méthode existante pour supprimer le compte utilisateur
    public function destroy(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();
        Auth::logout();
        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    // Méthode pour afficher le profil d'un utilisateur en fonction de l'ID
    public function show($id)
    {
        // Récupérer l'utilisateur par son ID
        $user = User::findOrFail($id);

        return Inertia::render('Profile/Show', [
            'user' => $user,
        ]);
    }
}
