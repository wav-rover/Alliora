<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Team extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($team) {
            $team->team_code = self::generateUniqueTeamCode();
        });
    }

    public static function generateUniqueTeamCode()
    {
        $teamCode = strtoupper(Str::random(5));

        if (self::where('team_code', $teamCode)->exists()) {
            return self::generateUniqueTeamCode();
        }

        return $teamCode;
    }

    // Relation avec les projets
    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    // Relation avec les utilisateurs (via Team_User)
    public function users()
    {
        return $this->belongsToMany(User::class, 'team_user')
                    ->withPivot('role')
                    ->withTimestamps();
    }

    public function creator()
{
    return $this->belongsTo(User::class, 'created_by');
}

}
