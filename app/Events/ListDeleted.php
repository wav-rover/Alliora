<?php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\ListModel;

class ListDeleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $list;

    public function __construct(ListModel $list)
    {
        $this->list = $list;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('task.' . $this->list->project_id),
        ];
    }

    public function broadcastAs()
    {
        return 'list.deleted';
    }
}
