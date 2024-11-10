"use client"

import React from 'react'
import { ProjectRadialChart } from '../ui/charts/project-charts-radial'
import { ProjectRadarChart } from '../ui/charts/project-charts-radar'
import ProjectAreaChart from '../ui/charts/project-charts-area'
import ProjectBarChart from '../ui/charts/project-charts-bar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const ProjectStats = ({ tasks: initialTasks, projectId, onTaskModified, initialLists, onListModified, users }) => {
    const taskCountByUser = users.map(user => ({
        name: user.name,
        tasks: initialTasks.filter(task => task.user_id === user.id).length || 0
    }))

    const taskCounts = initialLists.map(list => ({
        name: list.title,
        count: initialTasks.filter(task => task.list_id === list.id).length,
        color: `var(--color-${list.id})`,
    }))

    const taskStatusData = initialTasks
        .filter((task) => task.project_id === projectId)
        .reduce((acc, task) => {
            const status = task.status || "Non défini"
            acc[status] = (acc[status] || 0) + 1
            return acc
        }, {})

    const chartData = Object.keys(taskStatusData).map((status) => ({
        status,
        count: taskStatusData[status],
    }))

    return (
        <div className="h-full p-6">
            <Carousel className="w-full h-full mt-10" infinite autoplay>
                <CarouselContent>
                    <CarouselItem>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                            <ProjectRadialChart taskCounts={taskCounts} />
                            <ProjectRadarChart taskCountByUser={taskCountByUser} />
                            <ProjectBarChart taskStatusData={chartData} />
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <Card className="w-full h-full">
                            <CardContent className="p-4 h-full">
                                <ProjectAreaChart tasks={initialTasks} />
                            </CardContent>
                        </Card>
                    </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}

export default ProjectStats