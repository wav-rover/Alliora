import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import TaskBoard from '../Components/data/TasksBoard';
import { UsersOnProject } from '../Components/data/UsersOnProject';
import axios from 'axios';

const ProjectShowPage = () => {
    const { project: initialProject, users: initialUsers } = usePage().props; 
    const [project, setProject] = useState(initialProject);
    const [users, setUsers] = useState(initialUsers || []);

    useEffect(() => {
        console.log('Écoute du canal privé pour les tâches du projet :', project.id);
        
        const taskListener = window.Echo.private('task.' + project.id)
            .listen('.task.new', function (e) {
                console.log('Nouvelle tâche reçue :', e.task);
                setProject((prevProject) => ({
                    ...prevProject,
                    tasks: [...prevProject.tasks, e.task],
                }));
            })
            .listen('.task.edited', function (e) {
                console.log('Tâche modifiée reçue :', e.task);
                setProject((prevProject) => ({
                    ...prevProject,
                    tasks: prevProject.tasks.map((task) =>
                        task.id === e.task.id ? e.task : task
                    ),
                }));
            })
            .listen('.task.deleted', function (e) {
                console.log('Tâche supprimée reçue :', e.task);
                setProject((prevProject) => ({
                    ...prevProject,
                    tasks: prevProject.tasks.filter((task) => task.id !== e.task.id),
                }));
            })
            .listen('.list.created', function (e) {
                console.log('Nouvelle liste reçue :', e.list);
                setProject((prevProject) => ({
                    ...prevProject,
                    lists: [...prevProject.lists, e.list],
                }));
            })
            .listen('.list.edited', function (e) {
                console.log('Liste modifiée reçue :', e.list);
                setProject((prevProject) => ({
                    ...prevProject,
                    lists: prevProject.lists.map((list) =>
                        list.id === e.list.id ? e.list : list
                    ),
                }));
            })
            .listen('.list.deleted', function (e) {
                console.log('Liste supprimée reçue :', e.list);
                setProject((prevProject) => ({
                    ...prevProject,
                    lists: prevProject.lists.filter((list) => list.id !== e.list.id),
                }));
            })
            .error(function (error) {
                console.error('Erreur lors de l\'écoute du canal privé :', error);
            });
    
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
                    project_id: taskData.project_id,
                });
                console.log('Tâche créée:', response.data);
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

    const onListModified = async (action, listData) => {
        try {
            if (action === 'create') {
                const response = await axios.post('/lists', {
                    title: listData.title,
                    project_id: project.id,
                });
                console.log('Liste créée:', response.data);
                setProject((prevProject) => {
                    const exists = prevProject.lists.some(list => list.id === response.data.id);
                    if (!exists) {
                        return {
                            ...prevProject,
                            lists: [...prevProject.lists, response.data],
                        };
                    }
                    return prevProject;
                });
            }
            if (action === 'edit') {
                const response = await axios.put(`/lists/${listData.id}`, {
                    title: listData.title,
                });
                console.log('Liste modifiée:', response.data);
                setProject((prevProject) => ({
                    ...prevProject,
                    lists: prevProject.lists.map((list) =>
                        list.id === listData.id ? response.data : list
                    ),
                }));
            }
            if (action === 'delete') {
                await axios.delete(`/lists/${listData.id}`);
                console.log('Liste supprimée:', listData);
                setProject((prevProject) => ({
                    ...prevProject,
                    lists: prevProject.lists.filter((list) => list.id !== listData.id),
                }));
            }
        } catch (error) {
            console.error('Erreur lors de la modification de la liste:', error);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Project Show" />
            <TaskBoard 
                tasks={project.tasks} 
                projectId={project.id} 
                onTaskModified={onTaskModified} 
                lists={project.lists} 
                onListModified={onListModified}
            />
            <div className='scale-75 mr-5 mb-10 flex h-fit absolute bottom-0 right-0'>
                <UsersOnProject 
                    initialUsers={project.users} // Pass users directly
                    projectId={project.id} // Pass project ID for presence channel
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default ProjectShowPage;
