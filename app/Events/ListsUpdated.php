<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\ListModel;

class ListsUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $lists;

    public function __construct(array $lists)
    {
        $this->lists = collect($lists); // Convertir le tableau en collection
    }

    public function broadcastOn()
    {
        return [
            new PrivateChannel('task.' . $this->lists->first()->project_id),
        ];
    }

    public function broadcastAs()
    {
        return 'lists.updated';
    }
}