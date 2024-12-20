<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Alliora') }}</title>
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        
        <script src="https://accounts.google.com/gsi/client" async defer></script>

        <!-- Google APIs Client Library -->
        <script src="https://apis.google.com/js/api.js" async defer></script>
        
        <!-- Scripts -->
        <script src="https://js.pusher.com/8.0.1/pusher.min.js"></script>
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
        <link rel="icon" href="{{ asset('icon.png') }}" type="image/x-icon">
    </head>
    <body class="dark bg-black font-sans antialiased scroll-container">
@inertia

    </body>
</html>
