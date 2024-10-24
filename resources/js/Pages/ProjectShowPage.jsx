import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import TaskBoard from '../Components/data/TasksBoard';
import axios from 'axios';

const ProjectShowPage = () => {
    const { project: initialProject } = usePage().props;
    const [project, setProject] = useState(initialProject);

    useEffect(() => {
        console.log('Écoute du canal privé pour les tâches du projet :', project.id);
        const taskListener = window.Echo.private('task.' + project.id)
            .listen('.task.new', function (e) {
                console.log('Nouvelle tâche reçue :', e.task);
                setProject((prevProject) => ({
                    ...prevProject,
                    tasks: [...prevProject.tasks, e.task], // Ajoute la nouvelle tâche reçue
                }));
            })
            .error(function (error) {
                console.error('Erreur lors de l\'écoute du canal privé :', error);
            });

        // Cleanup listener on component unmount
        return () => {
            taskListener.stopListening();
        };
    }, [project.id]);
    
    const onTaskModified = async (action, taskData) => {
        try {
            if (action === 'create') {
                const response = await axios.post('/tasks', {
                    name: taskData.name,
                    description: taskData.description,
                    project_id: taskData.project_id, // Utilise le project_id ici
                });
                console.log('Tâche créée:', response.data);
                // Ne pas ajouter la tâche ici, elle sera ajoutée par l'écouteur Pusher
            }
            if (action === 'edit') {
                const response = await axios.put(`/tasks/${taskData.id}`, {
                    name: taskData.name,
                    description: taskData.description,
                });
                console.log('Tâche modifiée:', response.data);
                setProject((prevProject) => ({
                    ...prevProject,
                    tasks: prevProject.tasks.map((task) =>
                        task.id === taskData.id ? response.data : task
                    ),
                }));
            }
            if (action === 'delete') {
                await axios.delete(`/tasks/${taskData.id}`);
                console.log('Tâche supprimée:', taskData);
                setProject((prevProject) => ({
                    ...prevProject,
                    tasks: prevProject.tasks.filter((task) => task.id !== taskData.id),
                }));
            }
        } catch (error) {
            console.error('Erreur lors de la modification de la tâche:', error);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Project Show" />
            <TaskBoard tasks={project.tasks} projectId={project.id} onTaskModified={onTaskModified} />
        </AuthenticatedLayout>
    );
};

export default ProjectShowPage;
