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

    public $userIds;
    public $teamName;
    public $projectName;
    public $message;

    public function __construct($userIds, $teamName, $projectName)
    {
        $this->userIds = $userIds;
        $this->teamName = $teamName;
        $this->projectName = $projectName;
        $this->message = "Project $projectName has been created.";
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