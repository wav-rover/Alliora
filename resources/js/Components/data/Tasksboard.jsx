import React, { useState } from 'react';

const TaskBoard = ({ tasks, projectId, onTaskModified, lists, onListModified }) => {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedTaskName, setEditedTaskName] = useState('');
    const [editedTaskDescription, setEditedTaskDescription] = useState('');

    const [newListTitle, setNewListTitle] = useState('');
    const [editingListId, setEditingListId] = useState(null);
    const [editedListTitle, setEditedListTitle] = useState('');

    const handleCreateTask = (e) => {
        e.preventDefault();
        onTaskModified('create', { 
            name: taskName, 
            description: taskDescription, 
            project_id: projectId
        });
        setTaskName('');
        setTaskDescription('');
        console.log('Nouvelle tâche envoyée au serveur');
    };

    const handleDeleteTask = (taskId) => {
        onTaskModified('delete', { id: taskId });
    };

    const handleEditClick = (task) => {
        setEditingTaskId(task.id);
        setEditedTaskName(task.name);
        setEditedTaskDescription(task.description);
    };

    const handleEditSubmit = (e, task) => {
        e.preventDefault();
        onTaskModified('edit', { 
            id: task.id, 
            name: editedTaskName, 
            description: editedTaskDescription 
        });
        setEditingTaskId(null);
    };

    const handleCreateList = (e) => {
        e.preventDefault();
        onListModified('create', { title: newListTitle });
        setNewListTitle('');
    };

    const handleEditListClick = (list) => {
        setEditingListId(list.id);
        setEditedListTitle(list.title);
    };

    const handleEditListSubmit = (e, list) => {
        e.preventDefault();
        onListModified('edit', { id: list.id, title: editedListTitle });
        setEditingListId(null);
    };

    const handleDeleteList = (listId) => {
        onListModified('delete', { id: listId });
    };

    return (
        <div className="task-board">
            <h2>Tâches associées au projet</h2>
            {tasks.length === 0 ? (
                <p>Aucune tâche disponible pour ce projet.</p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id}>
                            {editingTaskId === task.id ? (
                                <form onSubmit={(e) => handleEditSubmit(e, task)}>
                                    <input
                                        type="text"
                                        value={editedTaskName}
                                        onChange={(e) => setEditedTaskName(e.target.value)}
                                        required
                                    />
                                    <textarea
                                        value={editedTaskDescription}
                                        onChange={(e) => setEditedTaskDescription(e.target.value)}
                                        required
                                    />
                                    <button type="submit">Enregistrer</button>
                                    <button type="button" onClick={() => setEditingTaskId(null)}>Annuler</button>
                                </form>
                            ) : (
                                <>
                                    <h3>{task.name}</h3>
                                    <p>{task.description}</p>
                                    <button onClick={() => handleDeleteTask(task.id)}>Supprimer</button>
                                    <button onClick={() => handleEditClick(task)}>Modifier</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            <form onSubmit={handleCreateTask}>
                <h3>Créer une nouvelle tâche</h3>
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

            <h2>Listes associées au projet</h2>
            {lists.length === 0 ? (
                <p>Aucune liste disponible pour ce projet.</p>
            ) : (
                <ul>
                    {lists.map((list) => (
                        <li key={list.id}>
                            {editingListId === list.id ? (
                                <form onSubmit={(e) => handleEditListSubmit(e, list)}>
                                    <input
                                        type="text"
                                        value={editedListTitle}
                                        onChange={(e) => setEditedListTitle(e.target.value)}
                                        required
                                    />
                                    <button type="submit">Enregistrer</button>
                                    <button type="button" onClick={() => setEditingListId(null)}>Annuler</button>
                                </form>
                            ) : (
                                <>
                                    <h3>{list.title}</h3>
                                    <button onClick={() => handleDeleteList(list.id)}>Supprimer</button>
                                    <button onClick={() => handleEditListClick(list)}>Modifier</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            <form onSubmit={handleCreateList}>
                <h3>Créer une nouvelle liste</h3>
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
