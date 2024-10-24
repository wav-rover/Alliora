<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Auth;


Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('task.{projectId}', function ($user, $projectId) {
    if (Auth::check()) {
        return ['id' => $user->id, 'name' => $user->name];
    }
});