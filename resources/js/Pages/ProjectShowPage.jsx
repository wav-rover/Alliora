import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import TaskBoard from '../Components/data/TasksBoard';
import { UserTooltip, MousePositions } from '../Components/data/UsersOnProject';
import axios from 'axios';
import { FloatingDockWithLinks } from '../Components/ui/floating-dock-Links'
import { motion, AnimatePresence } from 'framer-motion'
import TeamChat from '@/Components/data/Team-chat';
import ProjectCharts from '@/Components/ui/charts/project-charts';
import ProjectCalendar from '@/Components/data/ProjectCalendar';

const ProjectShowPage = () => {

    const { auth } = usePage().props;

    const { project: initialProject, users: initialUsers } = usePage().props;
    const [project, setProject] = useState(initialProject);
    const [users, setUsers] = useState(initialUsers || []);
    const [selectedComponent, setSelectedComponent] = useState('taskboard');


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
            .listen('.tasks.updated', function (e) {
                setProject((prevProject) => ({
                    ...prevProject,
                    tasks: e.tasks,
                }));
            })
            .listen('.list.created', function (e) {
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
            .listen('.lists.updated', function (e) {
                setProject((prevProject) => ({
                    ...prevProject,
                    lists: e.lists,
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
            if (action === 'create' || action === 'createDependency') {
                const listTasks = project.tasks.filter(task => task.list_id === taskData.list_id);
                const response = await axios.post('/tasks', {
                    ...taskData,
                    position: listTasks.length
                });
                const newTask = response.data;
                setProject((prevProject) => ({
                    ...prevProject,
                    tasks: [...prevProject.tasks, newTask],
                }));
            }
            if (action === 'edit') {
                const response = await axios.put(`/tasks/${taskData.id}`, taskData);
                const updatedTask = response.data;
                setProject((prevProject) => ({
                    ...prevProject,
                    tasks: prevProject.tasks.map((task) =>
                        task.id === updatedTask.id ? updatedTask : task
                    ),
                }));
            }
            if (action === 'delete') {
                await axios.delete(`/tasks/${taskData.id}`);
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
                    position: listData.position
                });
                console.log('Liste créée:', response.data);
            }
            if (action === 'edit') {
                const response = await axios.put(`/lists/${listData.id}`, {
                    title: listData.title,
                    position: listData.position,
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

    const renderComponent = () => {
        if (selectedComponent === 'taskboard') {
            console.log('COmposant changé', selectedComponent);
            return (
                <TaskBoard
                    tasks={project.tasks}
                    projectId={project.id}
                    onTaskModified={onTaskModified}
                    initialLists={project.lists}
                    onListModified={onListModified}
                    users={users}
                />
            );
        }

        if (selectedComponent === 'projectcharts') {
            return <ProjectCharts projectId={project.id} />;
        }

        if (selectedComponent === 'projectcalendar') {
            return <ProjectCalendar projectId={project.id} />;
        }
    };

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Project Show" />
                {renderComponent()}

                {/* Mouse positions of all users, it's working but don't use it if you don't want to 
                make Pusher go insane also absolutely not recomended performance wise 
                <MousePositions
                    projectId={project.id}
                    currentUserId={auth.user?.id}
                />*/}

                <UserTooltip projectId={project.id} />
            </AuthenticatedLayout>

            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.5 }}
            >
                <FloatingDockWithLinks
                    onListModified={onListModified}
                    onLinkClick={setSelectedComponent} // Pass setSelectedComponent as onLinkClick
                />
            </motion.div>

            <TeamChat />

        </>
    );
};

export default ProjectShowPage;