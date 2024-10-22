import React, { useState } from 'react';

const Projects = ({ projects, onProjectModified, adminTeams }) => {
    const [editingProject, setEditingProject] = useState(null);
    const [editedProjectName, setEditedProjectName] = useState('');
    const [editedProjectDescription, setEditedProjectDescription] = useState('');
    const [editedProjectTeam, setEditedProjectTeam] = useState('');

    if (!Array.isArray(projects) || projects.length === 0) {
        return <div>No projects available</div>;
    }
    // Active le mode édition pour un projet
    const handleEditClick = (project) => {
        setEditingProject(project.id);
        setEditedProjectName(project.name);
        setEditedProjectDescription(project.description);
        setEditedProjectTeam(project.team_id);
    };

    // Gère la soumission des modifications
const handleEditSubmit = async (e, project) => {
    e.preventDefault();
    await onProjectModified('edit', {
        id: project.id,
        name: editedProjectName,
        description: editedProjectDescription,
        team_id: editedProjectTeam, // Utilise la valeur de l'équipe sélectionnée
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
                                        <select
                                            value={editedProjectTeam}
                                            onChange={(e) => setEditedProjectTeam(e.target.value)}
                                        >
                                            <option value="">Select a Team</option>
                                            {adminTeams.length > 0 ? (
                                                adminTeams.map((team) => (
                                                    <option key={team.id} value={team.id}>
                                                        {team.name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>No teams available</option>
                                            )}
                                        </select>
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
