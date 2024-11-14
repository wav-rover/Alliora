<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel; 
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class UserAddedToTeam implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $userIds;
    public $teamName;
    public $message;

    public function __construct($userIds, $teamName)
    {
        $this->userIds = $userIds;
        $this->teamName = $teamName;
        $this->message = "You have been added to a new team.";
    }

    public function broadcastOn()
    {
        return array_map(function($userId) {
            return new PrivateChannel('notifications.' . $userId);
        }, $this->userIds);
    }

    public function broadcastAs()
    {
        return 'notification.sent';
    }
}