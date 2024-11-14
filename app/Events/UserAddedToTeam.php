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

    public $userId;
    public $teamName;
    public $message;

    public function __construct($userId, $teamName)
    {
        $this->userId = $userId;
        $this->teamName = $teamName;
        $this->message = "You have been added to a new team";
    }

    public function broadcastOn()
    {
        return new PrivateChannel('notifications.' . $this->userId);
    }

    public function broadcastAs()
    {
        return 'notification.sent';
    
    }
}