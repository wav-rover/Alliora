<?php

namespace App\Policies;

use App\Models\Team;
use App\Models\User;

class TeamPolicy
{
    // Only admins should be allowed to update the team
    public function update(User $user, Team $team)
    {
        return $team->users()->where('user_id', $user->id)->where('team_user.role', 'admin')->exists();
    }
}
