import React, { useState, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import CreateTask from '../form/create-task';
import TaskDetailDialog from './TaskDetailDialog';
import { current } from 'tailwindcss/colors';
import axios from 'axios';

const TaskBoard = ({ tasks: initialTasks, projectId, onTaskModified, initialLists, onListModified, users }) => {
    const [tasks, setTasks] = useState(initialTasks);
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [newListTitle, setNewListTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dependencies, setDependencies] = useState('');
    const [userId, setUserId] = useState('');
    const [status, setStatus] = useState('pending');
    const [selectedTask, setSelectedTask] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [lists, setLists] = useState(initialLists);
    useEffect(() => {
        setTasks(initialTasks);
    }, [initialTasks]);
    
    useEffect(() => {
        console.log("RECHARGEMENT!!!!!!!!!!!!")
        setLists(initialLists.sort((a, b) => a.position - b.position));
    }, [initialLists]);
    

    const onDragEnd = async (result) => {
        const { destination, source, draggableId, type } = result;
        if (!destination) return;
    
        if (type === 'list') {
            const updatedLists = Array.from(lists);
            const [movedList] = updatedLists.splice(source.index, 1);
            updatedLists.splice(destination.index, 0, movedList);
    
            const listsWithUpdatedPositions = updatedLists.map((list, index) => ({
                ...list,
                position: index
            }));
    
            setLists(listsWithUpdatedPositions);
            console.log('envoi')
            try {
                const response = await axios.put(`/lists`, {
                    projectId,
                    lists: listsWithUpdatedPositions.map(({ id, position, title }) => ({ id, position, title }))
                });
    
                console.log('Réponse du serveur:', response.data);
    
                if (response.status === 200) {
                    setLists(listsWithUpdatedPositions);
                }
            } catch (error) {
                console.error("Erreur lors de la mise à jour des positions :", error);
            }
        }
    };
    
        const handleCreateTask = async (taskOrDependency, listId) => {
            if (taskOrDependency.preventDefault) {
                taskOrDependency.preventDefault();
                const newTask = {
                    name: taskName,
                    description: taskDescription,
                    project_id: projectId,
                    list_id: listId,
                    dependencies: dependencies,
                    status,
                    start_date: startDate,
                    end_date: endDate,
                    user_id: userId,
                };

                try {
                    const response = await axios.post('/tasks', newTask);
                    const createdTask = response.data;
                    setTasks([...tasks, createdTask]);
                    setTaskName('');
                    setTaskDescription('');
                    setStatus('pending');

                } catch (error) {
                    console.error("Erreur lors de la création de la tâche :", error);
                }
            } else {
                const dependency = taskOrDependency;

                try {
                    const response = await axios.post('/tasks', dependency);
                } catch (error) {
                    console.error("Erreur lors de la création de la dépendance :", error);
                }
            }
        };



        const handleTaskEdit = (taskData) => {
            const updatedTasks = tasks.map(task =>
                task.id === taskData.id ? { ...task, ...taskData } : task
            );
            setTasks(updatedTasks);
            onTaskModified('edit', taskData);
        };

        const handleDeleteTask = (taskId) => {
            const updatedTasks = tasks.filter(task => task.id !== taskId && task.dependencies !== taskId);

            setTasks(updatedTasks);
            onTaskModified('delete', { id: taskId });
        };

        const handleCreateList = async (listData) => {
            if (listData.preventDefault) {
                listData.preventDefault();
                const newPosition = lists.length;

                const newList = {
                    title: newListTitle,
                    project_id: projectId,
                    position: newPosition
                };

                try {
                    const response = await axios.post('/lists', newList);
                    const createdList = response.data;
                    setLists([...lists, createdList]);
                    setNewListTitle('');

                } catch (error) {
                    console.error("Erreur lors de la création de la liste :", error);
                }
            }
        }

        const handleDeleteList = (listId) => {
            onListModified('delete', { id: listId });
            const updatedLists = lists.filter(list => list.id !== listId);
            setLists(updatedLists);
        };

        const handleTaskClick = (task) => {
            setSelectedTask({ ...task });
            setIsDialogOpen(true);
        };

        const handleCloseDialog = () => {
            setIsDialogOpen(false);
            setSelectedTask(null);
        };

        const findDependencies = (taskId, depth = 0) => {
            const dependencies = [];

            const findRecursively = (id, currentDepth) => {
                const dependentTasks = tasks.filter(task => task.dependencies === id);

                dependentTasks.forEach(dependentTask => {
                    dependencies.push({ task: dependentTask, depth: currentDepth });
                    findRecursively(dependentTask.id, currentDepth + 1); // Incrémenter la profondeur
                });
            };

            findRecursively(taskId, depth);
            const sortedDependencies = dependencies.sort((a, b) => {
                if (a.depth !== b.depth) {
                    return a.depth - b.depth;
                }
                return a.task.name.localeCompare(b.task.created_at); 
            });
            return sortedDependencies;
        };


        return (
            <div>
                <h2>Tâches associées au projet</h2>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="all-lists" direction="horizontal" type="list">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} className="flex">
                                {lists.map((list, index) => (
                                    <Draggable key={list.id} draggableId={list.id.toString()} index={index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <div className='p-3 bg-gray-500 m-2'>
                                                    <h3>{list.title} {list.position}</h3>
                                                    <button onClick={() => handleDeleteList(list.id)}>Supprimer Liste</button>
                                                    <ul className="task-list">
                                                        {tasks
                                                            .filter(task => task.list_id === list.id && task.dependencies === null)
                                                            .map((task) => {
                                                                const allDependencies = findDependencies(task.id);
                                                                return (
                                                                    <li key={task.id} className="task-item">
                                                                        <h4 onClick={() => handleTaskClick(task)} className="cursor-pointer">{task.name}</h4>
                                                                        <p>{task.description}</p>
                                                                        <p>{task.id}</p>
                                                                        <button onClick={() => handleDeleteTask(task.id)}>Supprimer</button>
                                                                        {allDependencies.map(({ task: dependencyTask, depth }) => (
                                                                            <h1 key={dependencyTask.id} onClick={() => handleTaskClick(dependencyTask)} className="cursor-pointer" style={{ marginLeft: `${depth * 10}px` }}>
                                                                                {dependencyTask.name}
                                                                            </h1>
                                                                        ))}
                                                                    </li>
                                                                );
                                                            })}
                                                    </ul>
                                                    <CreateTask
                                                        listId={list.id}
                                                        list={list}
                                                        taskName={taskName}
                                                        setTaskName={setTaskName}
                                                        taskDescription={taskDescription}
                                                        setTaskDescription={setTaskDescription}
                                                        handleCreateTask={handleCreateTask}
                                                        startDate={startDate}
                                                        setStartDate={setStartDate}
                                                        endDate={endDate}
                                                        setEndDate={setEndDate}
                                                        dependencies={dependencies}
                                                        setDependencies={setDependencies}
                                                        userId={userId}
                                                        setUserId={setUserId}
                                                        status={status}
                                                        setStatus={setStatus}
                                                        tasks={tasks}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                <form onSubmit={handleCreateList}>
                    <input
                        type="text"
                        placeholder="Titre de la liste"
                        value={newListTitle}
                        onChange={(e) => setNewListTitle(e.target.value)}
                        required
                    />
                    <button type="submit">Ajouter Liste</button>
                </form>

                {selectedTask && (
                    <TaskDetailDialog
                        list={lists.find(list => list.id === selectedTask.list_id)}
                        task={selectedTask}
                        isOpen={isDialogOpen}
                        onClose={handleCloseDialog}
                        users={users}
                        onTaskUpdate={handleTaskEdit}
                        handleCreateTask={handleCreateTask}
                        tasks={tasks}
                        handleTaskClick={handleTaskClick}
                        selectedTask={selectedTask}
                        setSelectedTask={setSelectedTask}
                    />
                )}
            </div>
        );
    };

    export default TaskBoard;