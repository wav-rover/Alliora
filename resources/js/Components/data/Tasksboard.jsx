import React, { useState } from 'react';

const TaskBoard = ({ tasks, projectId, onTaskModified }) => {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedTaskName, setEditedTaskName] = useState('');
    const [editedTaskDescription, setEditedTaskDescription] = useState('');

    const handleCreateTask = (e) => {
        e.preventDefault();
        onTaskModified('create', { 
            name: taskName, 
            description: taskDescription, 
            project_id: projectId // Ajout de project_id ici
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
        </div>
    );
};

export default TaskBoard;
