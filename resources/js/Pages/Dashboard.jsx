'use client'

import { useEffect } from 'react'
import { motion, useAnimate, stagger } from 'framer-motion'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { usePage } from "@inertiajs/react"
import { Vortex } from '@/Components/ui/vortex'
import DashboardChart from '@/Components/ui/charts/dashboard-chart'
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Clock, Target, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function Dashboard() {
    const { auth, recentProjects, upcomingTasks, projects, tasks } = usePage().props
    const maxParticleCount = 1000
    const particleCount = Math.min(projects.length * 50, maxParticleCount)

    const [scope, animate] = useAnimate()

    useEffect(() => {
        animate([
            ['.dashboard-item', { opacity: [0, 1], y: [20, 0] }, { duration: 0.5, delay: stagger(0.1) }],
            ['.welcome-text', { opacity: [0, 1], x: [-20, 0] }, { duration: 0.2 }],
            ['.stats-item', { opacity: [0, 1], x: [20, 0] }, { duration: 0.3, delay: stagger(0.1, { startDelay: 0.4 }) }],
            ['.vortex-container', { scale: [0.9, 1] }, { duration: 0.5, delay: 0.5 }],
        ])
    }, [])

    const statusColors = {
        pending: 'bg-red-600 drop-shadow-[0_0_10px_rgba(250,0,0,0.2)]',
        'in progress': 'bg-cyan-500 drop-shadow-[0_0_10px_rgba(0,200,200,0.4)]',
        finished: 'bg-emerald-600 drop-shadow-[0_0_10px_rgba(0,200,100,0.6)]'
    };

    // Calculate project and task stats
    const closestTask = tasks.length > 0 ? tasks.reduce((closest, task) => {
        const currentDifference = Math.abs(new Date(task.end_date) - new Date());
        const closestDifference = Math.abs(new Date(closest.end_date) - new Date());
        return currentDifference < closestDifference ? task : closest;
    }, tasks[0]) : null;

    const completedTasks = tasks.filter(task => task.status === 'finished').length
    const productivityScore = Math.round((completedTasks / tasks.length) * 100) || 0
    const mostActiveProject = projects.reduce((max, project) =>
        tasks.filter(task => task.project_id === project.id).length >
            tasks.filter(task => task.project_id === max.id).length ? project : max, projects[0])
    const longestProjectName = projects.reduce((longest, project) =>
        project.name.length > longest.length ? project.name : longest, '')

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <motion.div
                ref={scope}
                className="py-12 px-4 mx-auto space-y-3 h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center gap-3 justify-between h-60">
                    <motion.div className="dashboard-item p-6 min-w-1/4 h-full bg-background border border-2 border-slate-100/5 rounded-xl">
                        <div className="text-white">
                            <motion.p className='welcome-text font-bold text-3xl text-pretty mb-4'>Welcome back <span className='drop-shadow-[0_0_10px_rgba(200,255,255,0.3)]'>{auth.user?.name}</span> !</motion.p>
                            <motion.div className="stats-item flex items-center gap-2">
                                <Target className="w-5 h-5 text-primary" />
                                <p>Productivity Score: {productivityScore}%</p>
                            </motion.div>
                            <motion.div className="stats-item flex items-center gap-2 mt-2">
                                <Users className="w-5 h-5 text-secondary" />
                                <p>Active in {projects.length} projects</p>
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.div className="dashboard-item p-6 w-2/4 h-full bg-background border border-2 border-slate-100/5 rounded-xl">
                        <div className="text-white">
                            <h3 className="text-xl font-semibold mb-4">Your Project Insights</h3>
                            <motion.p className="stats-item mb-2">
                                🏆 Most Active Project: "{mostActiveProject ? mostActiveProject.name : ' '}" with {mostActiveProject ? tasks.filter(task => task.project_id === mostActiveProject.id).length : 0} tasks
                            </motion.p>
                            <motion.p className="stats-item mb-2">
                                📏 Longest Project Name: "{longestProjectName || ' '}" ({longestProjectName ? longestProjectName.length : 0} characters)
                            </motion.p>
                            <motion.p className="stats-item mb-2">
                                🎨 Project Palette: {projects && projects.length > 0 ? projects.map(project => project.name.charAt(0)).join('') : ' '} (first letter of each project)
                            </motion.p>
                        </div>
                    </motion.div>

                    <motion.div className="vortex-container dashboard-item overflow-hidden mx-auto h-full w-1/4 bg-background/50 border border-2 border-background rounded-xl">
                        <Vortex
                            backgroundColor="transparent"
                            rangeY={100}
                            particleCount={particleCount}
                            baseHue={150}
                            className='flex justify-center items-center h-full'
                        >
                            <motion.div
                                className='relative z-10 flex flex-col justify-center items-center h-full'
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
                            >
                                <p className='text-7xl drop-shadow-[0_0_10px_rgba(200,255,255,0.3)]'>{projects.length}</p>
                                <p>joined projects</p>
                            </motion.div>
                        </Vortex>
                    </motion.div>
                </div>

                <div className='flex items-center gap-3 justify-between h-60'>
                    <motion.div className='dashboard-item w-1/4 flex flex-col justify-around h-full space-y-3'>
                        <motion.div
                            className="p-6 w-full h-full bg-neutral-900 rounded-xl"

                        >
                            <div className="text-white">
                                <h3 className="text-sm font-semibold mb-2">Task Countdown</h3>
                                {tasks && tasks.length > 0 ? (
                                    <div>
                                        <p className="text-lg font-bold">{closestTask.name} in <a href={`/projects/${closestTask.project_id}`}>{projects.find(project => project.id === closestTask.project_id)?.name}</a></p>
                                        <div className='flex items-center'>
                                            <p className={`mr-2 px-3 py-1 rounded-full text-xs w-fit font-semibold capitalize transition-all duration-200 ${statusColors[closestTask.status]}`}
                                            >{closestTask.status}</p>
                                            { closestTask.start_date ? (<p className="text-sm">Due in: {Math.ceil((new Date(closestTask.end_date) - new Date()) / (1000 * 60 * 60 * 24))} days</p>
                                        ) : (<p className="text-sm">No due date defined</p>)}
                                        </div>
                                        <p className="text-xs mt-2">That's about {closestTask.start_date ? (
                                            Math.ceil((new Date(closestTask.end_date) - new Date()) / (100000 * 60)) * 2
                                        ) : 
                                        ( 'an infinite amount of')} coffee breaks ☕</p>
                                    </div>
                                ) : (
                                    <p>No upcoming tasks. Time to invent a new project!</p>
                                )}
                            </div>
                        </motion.div>
                        <motion.div
                            className="p-7 w-full h-full bg-neutral-800 rounded-xl"

                        >
                            <div className="text-white flex items-center justify-start">
                                <p className='p-0'>{tasks.filter(task => task.status === 'pending' || task.status === 'in progress').length} remaining tasks</p>
                            </div>
                        </motion.div>
                    </motion.div>
                    <motion.div className="dashboard-item h-full w-1/4 rounded-xl">
                        <Carousel className="h-full" plugins={[
                            Autoplay({
                                delay: 3000,
                            }),
                        ]}>
                            <CarouselContent className="h-full">
                                {recentProjects.map(project => (

                                    <CarouselItem key={project.id} >
                                        <a className='w-full' href={`/projects/${project.id}`}>
                                            <motion.div
                                                className="flex flex-col justify-center rounded-xl items-center border-0 h-60 bg-background min-h-36">
                                                <div className="flex flex-col justify-start items-start p-10 h-full">
                                                    <h3 className="text-sm font-semibold mb-4">Recent projects</h3>
                                                    <h4 className="text-lg font-semibold">{project.name}</h4>
                                                    <p>Created: {new Date(project.created_at).toLocaleDateString()}</p>
                                                    <p>Team: {project.team?.name}</p>
                                                    <p className="mt-2 text-sm italic">Tasks: {tasks.filter(task => task.project_id === project.id).length}</p>
                                                </div>
                                            </motion.div>
                                        </a>
                                    </CarouselItem>

                                ))}
                            </CarouselContent>
                        </Carousel>
                    </motion.div>
                    <motion.div className="dashboard-item p-6 mx-auto h-full w-2/4 bg-background rounded-xl">
                        <div className="text-white">
                            <DashboardChart projects={projects} />
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </AuthenticatedLayout>
    )
}