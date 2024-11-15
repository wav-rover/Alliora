import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import CreateTask from '../form/create-task';
import TaskDetailDialog from './TaskDetailDialog';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '../ui/custom-toast';
import { Input } from '../ui/input';
import { ChevronRight, Plus, CornerDownRight, CheckCircle, Clock, X, Scroll } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

import useOutsideClick from '../ui/useOutsideClick';
import { ScrollArea } from '../ui/scroll-area';

const TaskBoard = ({ tasks: initialTasks, projectId, onTaskModified, initialLists, onListModified, users }) => {
    const [tasks, setTasks] = useState(initialTasks);
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dependencies, setDependencies] = useState('');
    const [userId, setUserId] = useState('');
    const [status, setStatus] = useState('pending');
    const [selectedTask, setSelectedTask] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingListId, setEditingListId] = useState(null);
    const [newListTitle, setNewListTitle] = useState('');

    const [isOpen, setIsOpen] = useState(false)
    const [lists, setLists] = useState(initialLists);
    useEffect(() => {
        setTasks(initialTasks.sort((a, b) => a.position - b.position));
    }, [initialTasks]);

    useEffect(() => {
        setLists(initialLists.sort((a, b) => a.position - b.position));
    }, [initialLists]);

    const inputRef = useRef(null);
    useOutsideClick(inputRef, () => {
        if (editingListId !== null) {
            handleUpdateListTitle(editingListId);
            setEditingListId(null);
        }
    });

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
        if (type === 'task') {
            const sourceListId = source.droppableId;
            const destinationListId = destination.droppableId;

            if (sourceListId !== destinationListId) {
                const sourceListTasks = tasks.filter(task => task.list_id === parseInt(sourceListId));
                const destinationListTasks = tasks.filter(task => task.list_id === parseInt(destinationListId));

                const [movedTask] = sourceListTasks.splice(source.index, 1);

                movedTask.list_id = parseInt(destinationListId);
                destinationListTasks.splice(destination.index, 0, movedTask);

                const updatedSourceListTasks = sourceListTasks.map((task, index) => ({
                    ...task,
                    position: index,
                }));

                const updatedDestinationListTasks = destinationListTasks.map((task, index) => ({
                    ...task,
                    position: index,
                }));

                const updatedTasks = tasks
                    .filter(task => task.list_id !== parseInt(sourceListId) && task.list_id !== parseInt(destinationListId))
                    .concat(updatedSourceListTasks, updatedDestinationListTasks);

                setTasks(updatedTasks);

                try {
                    await axios.put('/tasks', {
                        tasks: updatedTasks.map(task => ({
                            id: task.id,
                            list_id: task.list_id,
                            position: task.position
                        }))
                    });
                    console.log('Positions mises à jour dans la base de données');
                } catch (error) {
                    console.error('Erreur lors de la mise à jour des positions :', error);
                }
            } else {
                const listTasks = tasks.filter(task => task.list_id === parseInt(sourceListId));
                const [movedTask] = listTasks.splice(source.index, 1);
                listTasks.splice(destination.index, 0, movedTask);

                console.log('Moved Task in Same List:', movedTask);
                console.log('Updated List Tasks:', listTasks);

                const tasksWithUpdatedPositions = listTasks.map((task, index) => ({
                    ...task,
                    position: index
                }));

                const updatedTasks = tasks
                    .filter(task => task.list_id !== parseInt(sourceListId))
                    .concat(tasksWithUpdatedPositions);

                setTasks(updatedTasks);

                try {
                    await axios.put('/tasks', {
                        tasks: updatedTasks.map(task => ({
                            id: task.id,
                            list_id: task.list_id,
                            position: task.position
                        }))
                    });
                    console.log('Positions mises à jour dans la base de données');
                } catch (error) {
                    console.error('Erreur lors de la mise à jour des positions :', error);
                }
            }
        }
    };

    const handleCreateTask = async (taskOrDependency, listId) => {
        if (taskOrDependency.preventDefault) {
            taskOrDependency.preventDefault();
            const listTasks = tasks.filter(task => task.list_id === listId);
            const newTask = {
                name: taskName,
                description: taskDescription,
                project_id: projectId,
                list_id: listId,
                dependencies: dependencies,
                status,
                start_date: startDate,
                end_date: endDate,
                position: listTasks.length,
                user_id: userId,
            };

            console.log(newTask)

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
        setSelectedTask(null);
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

    const handleEditListTitle = (listId, currentTitle) => {
        setEditingListId(listId);
        setNewListTitle(currentTitle);
    };

    const handleUpdateListTitle = async (listId) => {
        try {
            const response = await axios.put(`/lists/${listId}`, { title: newListTitle });
            const updatedList = response.data;
            setLists(lists.map(list => (list.id === listId ? updatedList : list)));
            setEditingListId(null);
            setNewListTitle('');
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la liste :", error);
        }
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
                findRecursively(dependentTask.id, currentDepth + 1);
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

    const getRemainingDays = (startDate, endDate) => {
        const now = new Date();
        if (new Date(startDate) < now && new Date(endDate) > now) {
            return Math.max(0, Math.ceil((new Date(endDate) - now) / (1000 * 60 * 60 * 24))) + "d";
        }
        return `${new Date(startDate).getDate()}/${new Date(startDate).getMonth() + 1} - ${new Date(endDate).getDate()}/${new Date(endDate).getMonth() + 1}`;
    };

    const statusColors = {
        pending: 'bg-red-600 drop-shadow-[0_0_10px_rgba(250,0,0,0.7)]',
        'in progress': 'bg-cyan-500 drop-shadow-[0_0_10px_rgba(0,200,200,0.7)]',
        finished: 'bg-emerald-600 drop-shadow-[0_0_10px_rgba(0,200,100,0.7)]'
    }

    return (
        <ScrollArea className='h-[82vh]'>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="all-lists" direction="horizontal" type="list">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} className="flex justify-start items-start">
                            {lists.map((list, index) => (
                                <Draggable key={list.id} draggableId={list.id.toString()} index={index}>
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                            <div className='cursor-grab m-2 rounded-xl p-3 w-60 bg-neutral-900 hover:bg-neutral-800/80 transition'>
                                                <div className='border-0 border-b-2 border-neutral-800/40 pb-1 flex justify-between items-start'>
                                                    {editingListId === list.id ? (
                                                        <Input
                                                            autoFocus
                                                            minlength="3" maxlength="20"
                                                            ref={inputRef}
                                                            type="text"
                                                            value={newListTitle}
                                                            onChange={(e) => setNewListTitle(e.target.value)}
                                                            onBlur={() => handleBlur(list.id)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    handleUpdateListTitle(list.id);
                                                                }
                                                            }}
                                                            className="list-title-input"
                                                        />
                                                    ) : (
                                                        <h3 onClick={() => handleEditListTitle(list.id, list.title)} className="cursor-pointer text-wrap text-lg font-bold list-title">
                                                            {list.title}
                                                        </h3>
                                                    )}
                                                    <button onClick={() => handleDeleteList(list.id)}><X className='h-4' /></button>
                                                </div>
                                                <Droppable droppableId={list.id.toString()} type="task">
                                                    {(provided) => (
                                                        <ul ref={provided.innerRef} {...provided.droppableProps} className="min-h-24">
                                                            {tasks
                                                                .filter(task => task.list_id === list.id && task.dependencies === null)
                                                                .map((task, index) => {
                                                                    const allDependencies = findDependencies(task.id);
                                                                    return (
                                                                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                                            {(provided) => (
                                                                                <li
                                                                                    ref={provided.innerRef}
                                                                                    {...provided.draggableProps}
                                                                                    {...provided.dragHandleProps}
                                                                                    onClick={() => handleTaskClick(task)}
                                                                                    className="cursor-grab my-2 task-item p-3 py-2 rounded-xl bg-background hover:bg-gray-400 hover:text-background transition-all ease-in"
                                                                                >
                                                                                    <div className='flex items-center justify-between gap-2'>
                                                                                        <div className='flex items-center justify-start gap-2'>
                                                                                            <div className={`w-2 h-2 rounded-full animate-pulse ${statusColors[task.status]}`}></div>
                                                                                            <h4 className="cursor-pointer">
                                                                                                {task.name.length > 20 ? (
                                                                                                    `${task.name.substring(0, 20)}...`
                                                                                                ) : (
                                                                                                    task.name
                                                                                                )}
                                                                                            </h4>
                                                                                        </div>
                                                                                        {task.start_date && task.end_date && (
                                                                                            <span className="text-xs">
                                                                                                {getRemainingDays(task.start_date, task.end_date)}
                                                                                            </span>
                                                                                        )}
                                                                                    </div>

                                                                                    {allDependencies.length > 0 && (
                                                                                        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                                                                                            <CollapsibleTrigger asChild>
                                                                                                <button
                                                                                                    className="flex items-center mt-2 text-sm focus:outline-none"
                                                                                                    onClick={(e) => e.stopPropagation()} // Prevent triggering handleTaskClick
                                                                                                >
                                                                                                    <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                                                                                                    <span>Dependencies</span>
                                                                                                </button>
                                                                                            </CollapsibleTrigger>
                                                                                            <CollapsibleContent>
                                                                                                <div className='flex items-start'>
                                                                                                    <div className='pl-2 w-full'>
                                                                                                        {allDependencies.map(({ task: dependencyTask, depth }, index) => (
                                                                                                            <div key={dependencyTask.id} className='relative flex items-center py-1'>
                                                                                                                {Array.from({ length: depth + 1 }).map((_, i) => (
                                                                                                                    <div
                                                                                                                        key={i}
                                                                                                                        className='absolute w-px bg-neutral-800/70'
                                                                                                                        style={{
                                                                                                                            left: `${i * 10}px`,
                                                                                                                            top: index === 0 ? '50%' : '0',
                                                                                                                            bottom: index === allDependencies.length ? '50%' : '0',
                                                                                                                        }}
                                                                                                                    />
                                                                                                                ))}
                                                                                                                <div
                                                                                                                    className='absolute w-2 h-px bg-neutral-800'
                                                                                                                    style={{ left: `${depth * 10}px` }}
                                                                                                                />
                                                                                                                <h1
                                                                                                                    onClick={(e) => {
                                                                                                                        e.stopPropagation()
                                                                                                                        handleTaskClick(dependencyTask)
                                                                                                                    }}
                                                                                                                    className="cursor-pointer ml-1"
                                                                                                                    style={{ marginLeft: `${(depth + 1) * 10}px` }}
                                                                                                                >
                                                                                                                    {dependencyTask.name}
                                                                                                                </h1>
                                                                                                            </div>
                                                                                                        ))}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </CollapsibleContent>
                                                                                        </Collapsible>
                                                                                    )}
                                                                                </li>
                                                                            )}
                                                                        </Draggable>
                                                                    );
                                                                })}
                                                            {provided.placeholder}
                                                        </ul>
                                                    )}
                                                </Droppable>
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
            {selectedTask && (
                <TaskDetailDialog
                    list={lists.find(list => list.id === selectedTask.list_id)}
                    task={selectedTask}
                    isOpen={isDialogOpen}
                    onClose={handleCloseDialog}
                    users={users}
                    onTaskUpdate={handleTaskEdit}
                    handleCreateTask={handleCreateTask}
                    handleDeleteTask={handleDeleteTask}
                    tasks={tasks}
                    handleTaskClick={handleTaskClick}
                    selectedTask={selectedTask}
                    setSelectedTask={setSelectedTask}
                />
            )}
        </ScrollArea>
    );
};

export default TaskBoard