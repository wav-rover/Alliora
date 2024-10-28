import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import CreateTask from '../form/create-task';

const TaskBoard = ({ tasks, projectId, onTaskModified, lists, onListModified }) => {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [newListTitle, setNewListTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dependencies, setDependencies] = useState([]);
    const [userId, setUserId] = useState('');
    const [status, setStatus] = useState('pending');


    const onDragEnd = (result) => {
        const { destination, source, draggableId, type } = result;

        if (!destination) {
            return;
        }

        if (type === 'list') {
            const list = lists.find(list => list.id === draggableId);
            const newPosition = destination.index + 1;

            if (source.index === destination.index) {
                return;
            }

        }

        if (type === 'task') {

            const task = tasks.find(task => task.id === draggableId);
            const newListId = destination.droppableId;
            const newPosition = destination.index + 1;

            if (source.index === destination.index && source.droppableId === destination.droppableId) {
                return;
            }

        }
    };

    const handleCreateTask = (e, listId, formattedDependencies) => {
        e.preventDefault();
        console.log('Creating task:', taskName, taskDescription, listId, startDate, endDate, formattedDependencies, userId, status);
        onTaskModified('create', {
          name: taskName,
          description: taskDescription,
          project_id: projectId,
          list_id: listId,
          position: lists.find(list => list.id === listId).tasks?.length || 1,
          status: status,
          start_date: startDate,
          end_date: endDate,
          dependencies: formattedDependencies, // This is now an array of integers
          user_id: userId,
        });
        setTaskName('');
        setTaskDescription('');
        setStatus('pending'); // Reset to default option
    };
    

    const handleDeleteTask = (taskId) => {
        onTaskModified('delete', { id: taskId });
    };

    const handleCreateList = (e) => {
        e.preventDefault();
        onListModified('create', { title: newListTitle });
        setNewListTitle('');
    };

    const handleDeleteList = (listId) => {
        onListModified('delete', { id: listId });
    };

    return (
        <div className="">
            <h2>Tâches associées au projet</h2>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="all-lists" direction="horizontal" type="list">
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex"
                        >
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
                                                                <h4>{task.name}</h4>
                                                                <p>{task.description}</p>
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
        </div>
    );
};

export default TaskBoard;