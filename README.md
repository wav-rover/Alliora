# Alliora - Project Management System

<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

## About Alliora

Alliora is a modern project management system built on Laravel with a React frontend. It provides powerful features for managing projects, tasks, teams and collaboration:

- **Project Management** - Create and manage projects with detailed tracking
- **Task Management** - Kanban board style task management with drag & drop
- **Team Collaboration** - Built-in team chat and notifications
- **Real-time Updates** - WebSocket integration for live updates
- **Interactive Dashboard** - Charts and statistics for project insights 
- **User Management** - Role-based access control and team management

## Core Features

- Project Creation & Management
- Task Boards with Drag & Drop
- Realtime updates
- Team Chat & Collaboration Tools
- Real-time Notifications
- Project Statistics & Charts
- Team Management
- User Authentication & Authorization

## Technical Stack

- **Backend**: Laravel 11
- **Frontend**: React with Inertia.js
- **Real-time**: Pusher and Laravel Echo
- **UI Components**: Shadcn components, Aceternity and Custom React components with Tailwind CSS
- **Charts**: Shadcn Charting Components
- **Database**: SQLite

## Getting Started

### Prerequisites

- PHP >= 8.1
- Composer
- Node.js & NPM
- SQLite

### Installation

1. Clone the repository:
```bash
git clone https://github.com/wav-rover/Alliora.git
```

2. Install PHP dependencies:
```bash
composer install
```

3. Install NPM packages:
```bash
npm install
```

4. Copy .env.example and configure:
```bash
cp .env.example .env
```

5. Generate application key:
```bash
php artisan key:generate
```

6. Run migrations:
```bash
php artisan migrate
```

7. Start the development server:
```bash
php artisan serve
npm run dev
```

## Contributing

Thank you for considering contributing to Alliora! Please read our contributing guidelines before submitting pull requests.

## Security Vulnerabilities

If you discover a security vulnerability, please send an email to our security team. All security vulnerabilities will be promptly addressed.

## License

Alliora is open-source software licensed under the [MIT license](https://opensource.org/licenses/MIT).
