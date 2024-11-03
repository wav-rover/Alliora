<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Task;

class TasksUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $tasks;

    public function __construct($tasks)
    {
        $this->tasks = collect($tasks);
    }

    public function broadcastOn()
    {
        $projectChannel = $this->tasks->isNotEmpty() ? 'task.' . $this->tasks->first()->project_id : null;

        return $projectChannel ? [new PrivateChannel($projectChannel)] : [];
    }


    public function broadcastAs()
    {
        return 'tasks.updated';
    }
}
