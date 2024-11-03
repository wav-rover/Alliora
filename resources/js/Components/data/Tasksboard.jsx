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
        setTasks(initialTasks.sort((a,b)=> a.position - b.position));
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
            
        }

                if (type === 'task') {
            const sourceListId = source.droppableId;
            const destinationListId = destination.droppableId;
        
            console.log('Source List ID:', sourceListId);
            console.log('Destination List ID:', destinationListId);
        
            // 1. Vérifier si la liste de destination est différente de celle d'origine
            if (sourceListId !== destinationListId) {
                // 2. Filtrer les tâches pour les listes source et destination
                const sourceListTasks = tasks
                    .filter(task => task.list_id === parseInt(sourceListId));
                const destinationListTasks = tasks
                    .filter(task => task.list_id === parseInt(destinationListId));
        
                console.log('Source List Tasks:', sourceListTasks);
                console.log('Destination List Tasks:', destinationListTasks);
        
                // 3. Retirer la tâche déplacée de la liste source
                const [movedTask] = sourceListTasks.splice(source.index, 1);
        
                console.log('Moved Task:', movedTask);
        
                // 4. Mettre à jour la position et la liste de la tâche déplacée
                movedTask.list_id = parseInt(destinationListId);
                destinationListTasks.splice(destination.index, 0, movedTask);
        
                console.log('Updated Moved Task:', movedTask);
                console.log('Updated Destination List Tasks:', destinationListTasks);
        
                // 5. Recalculer les positions dans les deux listes
                const updatedSourceListTasks = sourceListTasks.map((task, index) => ({
                    ...task,
                    position: index,
                }));
        
                const updatedDestinationListTasks = destinationListTasks.map((task, index) => ({
                    ...task,
                    position: index,
                }));
        
                console.log('Updated Source List Tasks:', updatedSourceListTasks);
                console.log('Updated Destination List Tasks:', updatedDestinationListTasks);
        
                // 6. Mettre à jour l'état global des tâches
                const updatedTasks = tasks
                    .filter(task => task.list_id !== parseInt(sourceListId) && task.list_id !== parseInt(destinationListId))
                    .concat(updatedSourceListTasks, updatedDestinationListTasks);
        
                console.log('Updated Tasks:', updatedTasks);
        
                setTasks(updatedTasks);
        
                // Envoi des nouvelles positions au backend avec axios
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
                // 7. Gérer le cas où la tâche est déplacée dans la même liste (sans changement de liste)
                const listTasks = tasks.filter(task => task.list_id === parseInt(sourceListId));
                const [movedTask] = listTasks.splice(source.index, 1);
                listTasks.splice(destination.index, 0, movedTask);
        
                console.log('Moved Task in Same List:', movedTask);
                console.log('Updated List Tasks:', listTasks);
        
                const tasksWithUpdatedPositions = listTasks.map((task, index) => ({
                    ...task,
                    position: index
                }));
        
                console.log('Tasks with Updated Positions:', tasksWithUpdatedPositions);
        
                const updatedTasks = tasks
                    .filter(task => task.list_id !== parseInt(sourceListId))
                    .concat(tasksWithUpdatedPositions);
        
                console.log('Updated Tasks:', updatedTasks);
        
                setTasks(updatedTasks);
        
                // Envoi des nouvelles positions au backend avec axios
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
                                                <h3>{list.title}</h3>
                                                <button onClick={() => handleDeleteList(list.id)}>Supprimer Liste</button>
                                                <Droppable droppableId={list.id.toString()} type="task">
                                                    {(provided) => (
                                                        <ul ref={provided.innerRef} {...provided.droppableProps}>
                                                            {tasks
                                                                .filter(task => task.list_id === list.id && task.dependencies === null)
                                                                .map((task, index) => {
                                                                    const allDependencies = findDependencies(task.id);
                                                                    return (
                                                                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                                            {(provided) => (
                                                                                <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="task-item">
                                                                                    <h4 onClick={() => handleTaskClick(task)} className="cursor-pointer">{task.name}  {task.position}</h4>
                                                                                    <button onClick={() => handleDeleteTask(task.id)}>Supprimer</button>
                                                                                    {allDependencies.map(({ task: dependencyTask, depth }) => (
                                                                                        <h1 key={dependencyTask.id} onClick={() => handleTaskClick(dependencyTask)} className="cursor-pointer" style={{ marginLeft: `${depth * 10}px` }}>
                                                                                            {dependencyTask.name}
                                                                                        </h1>
                                                                                    ))}
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