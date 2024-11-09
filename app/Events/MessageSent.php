<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel; // Assurez-vous d'importer PrivateChannel
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class MessageSent implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $message;
    public $projectId;

    public function __construct(Message $message, $projectId)
    {
        $this->message = $message;
        $this->projectId = $projectId;
    }

    public function broadcastOn()
    {
        // Diffuse sur le même canal privé que les autres événements
        return new PrivateChannel("task.{$this->projectId}");
    }

    public function broadcastWith()
    {
        return [
            'message' => [
                'id' => $this->message->id,
                'content' => $this->message->content,
                'user' => [
                    'name' => $this->message->user->name,
                    'img_profile' => $this->message->user->img_profile,
                ],
            ],
        ];
    }

    public function broadcastAs()
    {
        return 'message.sent';
    }
}