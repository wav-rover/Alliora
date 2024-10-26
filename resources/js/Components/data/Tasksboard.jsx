import React, { useState } from 'react';

const TaskBoard = ({ tasks, projectId, onTaskModified, lists, onListModified }) => {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [newListTitle, setNewListTitle] = useState('');

    const handleCreateTask = (e, listId) => {
        e.preventDefault();
        onTaskModified('create', { 
            name: taskName, 
            description: taskDescription, 
            project_id: projectId, 
            list_id: listId,
            position: lists.find(list => list.id === listId).tasks?.length || 1
        });
        setTaskName('');
        setTaskDescription('');
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
        <div className="task-board">
            <h2>Tâches associées au projet</h2>
            {lists.map(list => (
                <div key={list.id} className="list-section">
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
                    
                    <form onSubmit={(e) => handleCreateTask(e, list.id)}>
                        <input
                            type="text"
                            placeholder="Nom de la tâche"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Description de la tâche"
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                            required
                        />
                        <button type="submit">Ajouter Tâche</button>
                    </form>
                </div>
            ))}
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
