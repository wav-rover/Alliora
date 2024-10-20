<?php
namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class TeamController extends Controller
{
    // Use the AuthorizesRequests trait
    use AuthorizesRequests;

    public function index()
    {
        $user = Auth::user();
        $teams = Team::whereHas('users', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->with(['users' => function($query) {
            $query->select('users.id', 'users.name'); // Spécifie les colonnes que tu veux, excluant 'email'
        }, 'creator' => function($query) {
            $query->select('users.id', 'users.name'); // Spécifie les colonnes pour le créateur aussi
        }])
        ->get();

        return Inertia::render('TeamsPage', [
            'teams' => $teams
        ]);
    }

    public function getUsers($id)
    {
        $team = Team::find($id);
        if (!$team) {
            return response()->json(['message' => 'Team not found'], 404);
        }
    
        return response()->json($team->users);
    }

    public function joinTeam(Request $request)
    {
        try {
            $teamId = $request->input('team_id');
            $userId = Auth::id();

            $team = Team::findOrFail($teamId);
            $team->users()->attach($userId);

            return response()->json(['message' => 'Successfully joined the team'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to join the team', 'details' => $e->getMessage()], 500);
        }
    }


    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'members' => 'array',
        ]);

        $team = Team::create([
            'name' => $request->input('name'),
        ]);

        $team->users()->attach(Auth::user()->id, ['role' => 'admin']);

        if (!empty($request->input('members'))) {
            foreach ($request->input('members') as $memberId) {
                $team->users()->attach($memberId);
            }
        }

        return response()->json($team);
    }

    public function show($id)
    {
        $team = Team::with('users')->findOrFail($id);
        return response()->json($team);
    }

    public function update(Request $request, $id)
    {
        $team = Team::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $team->update($validated);
        return response()->json($team);
    }

    public function destroy($id)
    {
        $team = Team::findOrFail($id);
        $team->delete();
        return response()->json(null, 204);
    }

    // Promotes a member to admin
    public function promoteMember(Request $request, $teamId, $userId)
    {
        $team = Team::findOrFail($teamId);
        $this->authorize('update', $team); // Ensure the user has permission

        $user = $team->users()->where('user_id', $userId)->first();
        if ($user) {
            $user->pivot->role = 'admin';
            $user->pivot->save();
        }

        return response()->json(['message' => 'Member promoted to admin']);
    }

    // Demotes an admin to member
    public function demoteMember(Request $request, $teamId, $userId)
    {
        $team = Team::findOrFail($teamId);
        $this->authorize('update', $team); // Ensure the user has permission

        $user = $team->users()->where('user_id', $userId)->first();
        if ($user) {
            $user->pivot->role = 'member';
            $user->pivot->save();
        }

        return response()->json(['message' => 'Admin demoted to member']);
    }

 public function removeMember(Request $request, $teamId, $userId)
{
    $team = Team::findOrFail($teamId);
    $this->authorize('update', $team); // Vérifie si l'utilisateur actuel a la permission de mettre à jour l'équipe

    // Trouver l'utilisateur à retirer
    $userToRemove = $team->users()->findOrFail($userId);

    // Vérifier si l'utilisateur à supprimer est un admin (basé sur la colonne 'role' ou 'is_admin' dans la table pivot)
    $isAdmin = $userToRemove->pivot->role === 'admin'; // Modifie selon ta logique (ex: $userToRemove->pivot->is_admin)

    // Supprimer l'utilisateur de l'équipe
    $team->users()->detach($userId);

    // Si l'utilisateur supprimé était un admin, vérifier s'il reste des admins
    if ($isAdmin) {
        // Compter combien d'admins restent dans l'équipe
        $remainingAdmins = $team->users()->wherePivot('role', 'admin')->count(); // Modifie selon ta logique

        // Si aucun admin n'est présent, supprimer l'équipe
        if ($remainingAdmins === 0) {
            $team->delete();

            return response()->json(['message' => 'L\'équipe a été supprimée car il ne restait plus d\'admins.']);
        }
    }

    return response()->json(['message' => 'Membre retiré de l\'équipe.']);
}
public function leaveTeam(Request $request, $teamId)
{
    $team = Team::findOrFail($teamId);
    $user = Auth::user();

    // Vérifie si l'utilisateur fait partie de l'équipe
    if (!$team->users()->where('user_id', $user->id)->exists()) {
        return response()->json(['message' => 'Vous ne faites pas partie de cette équipe.'], 403);
    }

    // Trouve l'utilisateur dans l'équipe
    $userInTeam = $team->users()->where('user_id', $user->id)->first();
    
    // Vérifie si l'utilisateur est admin
    $isAdmin = $userInTeam->pivot->role === 'admin';

    // Supprime l'utilisateur de l'équipe
    $team->users()->detach($user->id);

    // Si l'utilisateur retiré était un admin, vérifier s'il reste des admins
    if ($isAdmin) {
        // Compter combien d'admins restent dans l'équipe
        $remainingAdmins = $team->users()->wherePivot('role', 'admin')->count();

        // Si aucun admin n'est présent, supprimer l'équipe
        if ($remainingAdmins === 0) {
            $team->delete();

            return response()->json(['message' => 'Vous avez quitté l\'équipe et celle-ci a été supprimée car il ne restait plus d\'admins.']);
        }
    }

    return response()->json(['message' => 'Vous avez quitté l\'équipe avec succès.']);
}

}
