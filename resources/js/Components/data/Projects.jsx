import React, { useState } from 'react';

const Projects = ({ projects, onProjectModified }) => {
    const [editingProject, setEditingProject] = useState(null);
    const [editedProjectName, setEditedProjectName] = useState('');
    const [editedProjectDescription, setEditedProjectDescription] = useState('');
    if (!Array.isArray(projects) || projects.length === 0) {
        return <div>No projects available</div>;
    }
    // Active le mode édition pour un projet
    const handleEditClick = (project) => {
        setEditingProject(project.id);
        setEditedProjectName(project.name);
        setEditedProjectDescription(project.description);
    };

    // Gère la soumission des modifications
    const handleEditSubmit = async (e, project) => {
        e.preventDefault();
        await onProjectModified('edit', {
            id: project.id,
            name: editedProjectName,
            description: editedProjectDescription,
            team_id: project.team_id, // Tu pourrais permettre de changer l'équipe aussi ici
        });
        setEditingProject(null); // Sortir du mode édition après la mise à jour
    };

    // Supprime un projet
    const handleDelete = async (projectId) => {
        await onProjectModified('delete', { id: projectId });
    };

    if (!projects || projects.length === 0) {
        return <div>No projects available</div>;
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Project Name</th>
                        <th>Team Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project) => (
                        <tr key={project.id}>
                            <td>
                                {editingProject === project.id ? (
                                    <form onSubmit={(e) => handleEditSubmit(e, project)}>
                                        <input
                                            type="text"
                                            value={editedProjectName}
                                            onChange={(e) => setEditedProjectName(e.target.value)}
                                            required
                                        />
                                        <input
                                            type="text"
                                            value={editedProjectDescription}
                                            onChange={(e) => setEditedProjectDescription(e.target.value)}
                                            required
                                        />
                                        <button type="submit">Save</button>
                                        <button onClick={() => setEditingProject(null)}>Cancel</button>
                                    </form>
                                ) : (
                                    <>
                                        {project.name}
                                    </>
                                )}
                            </td>
                            <td>{project.team ? project.team.name : 'No team assigned'}</td>
                            <td>
                                {editingProject !== project.id && (
                                    <>
                                        <button onClick={() => handleEditClick(project)}>Edit</button>
                                        <button onClick={() => handleDelete(project.id)}>Delete</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Projects;
