import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import TaskBoard from '../Components/data/TasksBoard';
import { UserTooltip, MousePositions } from '../Components/data/UsersOnProject';
import axios from 'axios';

const ProjectShowPage = () => {
    
  const { auth } = usePage().props;

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
                    list_id: taskData.list_id,
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
            <div className='scale-75 ml-10 mb-5 flex h-fit absolute bottom-0 left-0'>
                <UserTooltip projectId={project.id} />
            </div>
            {/* Mouse positions of all users, it's working but don't use it if you don't want to 
            make Pusher go insane also absolutely not recomended performance wise */}
            {/* <MousePositions 
                projectId={project.id}
                currentUserId={auth.user?.id}
            /> */}
        </AuthenticatedLayout>
    );
};

export default ProjectShowPage;