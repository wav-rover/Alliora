import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import CreateTask from '../form/create-task';
import TaskDetailDialog from './TaskDetailDialog';

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

    const onDragEnd = (result) => {
        const { destination, source, draggableId, type } = result;
        if (!destination) return;

        if (type === 'list') {
            if (source.index === destination.index) return;
            const updatedLists = Array.from(lists);
            const [movedList] = updatedLists.splice(source.index, 1);
            updatedLists.splice(destination.index, 0, movedList);
            setLists(updatedLists);
        }
    };

    const handleCreateTask = (taskOrDependency, listId) => {
        // Check if the argument is an event or a task/dependency object
        if (taskOrDependency.preventDefault) {
            // This is an event, handle task creation
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
            onTaskModified('create', newTask);
            setTasks([...tasks, newTask]);
            setTaskName('');
            setTaskDescription('');
            setStatus('pending');
        } else {
            console.log('Creating PAS:');
            const dependency = taskOrDependency;
            onTaskModified('createDependency', dependency);
            setTasks([...tasks, dependency]);
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

    const handleCreateList = (e) => {
        e.preventDefault();
        onListModified('create', { title: newListTitle });
        setNewListTitle('');
        setLists([...lists, { id: Math.random().toString(), title: newListTitle }]);
    };

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
                                                <ul className="task-list">
                                                    {tasks
                                                        .filter(task => task.list_id === list.id)
                                                        .map((task) => (
                                                            <li key={task.id} className="task-item">
                                                                <h4 onClick={() => handleTaskClick(task)} className="cursor-pointer">{task.name}</h4>
                                                                <p>{task.description}</p>
                                                                <p>Status: {task.status}</p>
                                                                <button onClick={() => handleDeleteTask(task.id)}>Supprimer</button>
                                                            </li>
                                                        ))}
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
                />
            )}
        </div>
    );
};

export default TaskBoard;