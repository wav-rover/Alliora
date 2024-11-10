import React from 'react';
import { ProjectRadialChart } from '../ui/charts/project-charts-radial';
import { ProjectRadarChart } from '../ui/charts/project-charts-radar';
import ProjectAreaChart from '../ui/charts/project-charts-area';
import ProjectBarChart from '../ui/charts/project-charts-bar';

const ProjectStats = ({ tasks: initialTasks, projectId, onTaskModified, initialLists, onListModified, users }) => {

    const taskCountByUser = users.map(user => {
        const taskCount = initialTasks.filter(task => task.user_id === user.id).length;
        return { name: user.name, tasks: taskCount || 0 };  // Changed 'initialTasks' to 'tasks'
      });

    const calculateTaskCounts = (initialTasks, lists) => {
        return lists.map(list => ({
            name: list.title,
            count: initialTasks.filter(task => task.list_id === list.id).length,
            color: `var(--color-${list.id})`,
        }))
    }
    const taskCounts = calculateTaskCounts(initialTasks, initialLists);

    const taskStatusData = initialTasks
    .filter((initialTasks) => initialTasks.project_id === projectId)
    .reduce((acc, initialTasks) => {
      const status = initialTasks.status || "Non défini"
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})

    const chartData = Object.keys(taskStatusData).map((status) => ({
        status,
        count: taskStatusData[status],
      }))
    
    return (
        <div>
            <h1>GRAPHIQUES</h1>
            <ProjectRadialChart taskCounts={taskCounts} />
            <ProjectRadarChart taskCountByUser={taskCountByUser} />
            <ProjectBarChart taskStatusData={chartData} />
            <ProjectAreaChart tasks={initialTasks} />
        </div>
    );
};

export default ProjectStats;
