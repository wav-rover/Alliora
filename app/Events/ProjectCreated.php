<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel; 
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class ProjectCreated implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $userId;
    public $teamName;
    public $projectName;
    public $message;

    public function __construct($userId, $teamName, $projectName)
    {
        $this->userId = $userId;
        $this->teamName = $teamName;
        $this->projectName = $projectName;
        $this->message = "Project $projectName has been created";
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