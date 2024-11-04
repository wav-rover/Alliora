import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { usePage } from "@inertiajs/react";
import { SparklesCore } from "../Components/ui/sparkles";

export default function Dashboard() {
    const { auth, recentProjects, upcomingTasks, projectCount } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12 mx-auto space-y-3 w-3/4 h-full">
                {/* Box de bienvenue */}
                <div className="flex items-center gap-3 justify-between h-60">
                    <div className="p-6 w-3/4 h-full bg-background border border-2 border-slate-100/5 rounded-xl">
                        <div className="text-white">
                            <p className='font-bold text-4xl'>Welcome back <span className='drop-shadow-[0_0_10px_rgba(200,255,255,0.3)]'>{auth.user?.name}</span> !</p>
                        </div>
                    </div>
                    
                    <div className="relative overflow-hidden mx-auto h-full w-1/4 bg-background/50 border border-2 border-background rounded-xl">
                        <SparklesCore
                            background="transparent"
                            minSize={0.4}
                            maxSize={1}
                            particleDensity={500}
                            className="absolute inset-0 w-full h-full"
                            particleColor="#FFFFFF"
                        />
                        <div className='relative z-10 flex flex-col justify-center items-center h-full'>
                            <p className='text-7xl drop-shadow-[0_0_10px_rgba(200,255,255,0.3)]'>{projectCount}</p>
                            <p>Projets rejoints</p>
                        </div>
                    </div>
                    </div>

                    {/* Box des projets récents */}
                <div className='flex items-center gap-3 justify-between h-60'>
                    <div className='w-1/4 flex flex-col justify-around h-full space-y-3'>
                        <div className="p-6 w-full h-full bg-neutral-800 rounded-xl">
                            <div className="text-white">
                                <h3 className="text-xl font-semibold mb-2">5 Derniers Projets</h3>
                                <ul className="space-y-1">
                                    {recentProjects.map(project => (
                                        <li key={project.id} className="text-sm">
                                            {project.name} - {new Date(project.created_at).toLocaleDateString()}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Tâches à venir */}
                        <div className="p-6 w-full h-full bg-neutral-900 rounded-xl">
                            <div className="text-white">
                                <h3 className="text-xl font-semibold mb-2">Tâches à venir</h3>
                                <ul className="space-y-1">
                                    {upcomingTasks.slice(0, 3).map(task => (
                                        <li key={task.id} className="text-sm">
                                            {recentProjects.find(project => project.id === task.project_id)?.name} - 
                                            {task.name} - {new Date(task.start_date).toLocaleDateString()}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Informations générales */}
                    <div className="p-6 mx-auto h-full w-1/4 bg-neutral-900 rounded-xl">
                        <div className="text-white">
                            <h3 className="text-xl font-semibold mb-2">Informations générales</h3>
                            {/* Place d'autres informations ou statistiques */}
                        </div>
                    </div>

                    {/* Espace pour d'autres contenus */}
                    <div className="p-6 mx-auto h-full w-2/4 bg-neutral-900 rounded-xl">
                        <div className="text-white">
                            <h3 className="text-xl font-semibold mb-2">Statistiques de performance</h3>
                            {/* Placeholder pour des graphiques ou KPIs */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
