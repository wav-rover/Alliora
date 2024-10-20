import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';

const Projects = () => {
    const { props } = usePage();
    const initialProjects = props.projects || [];
    const teams = props.teams || [];
    const [projects, setProjects] = useState(initialProjects);
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [selectedTeam, setSelectedTeam] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let teamId = selectedTeam;

            if (!teamId) {
                const teamResponse = await axios.post('/teams', {
                    name: projectName, // Utiliser le nom du projet comme nom de l'équipe
                    members: [/* ID du créateur */], // Remplacez par l'ID de l'utilisateur connecté
                });
                teamId = teamResponse.data.id; // Récupérer l'ID de la nouvelle équipe
            }

            const response = await axios.post('/projects', {
                name: projectName,
                description: projectDescription,
                team_id: teamId,
            });

            const newProject = response.data;
            setProjects((prevProjects) => [...prevProjects, newProject]);
            setProjectName('');
            setProjectDescription('');
            setSelectedTeam('');
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    return (
        <div>
            <h1>Projects</h1>
            <ul>
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <li key={project.id}>{project.name}: {project.description}</li>
                    ))
                ) : (
                    <li>No projects available</li>
                )}
            </ul>

            <h2>Create a New Project</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={projectName} 
                    onChange={(e) => setProjectName(e.target.value)} 
                    placeholder="Project Name"
                    className='text-black'
                    required 
                />
                <textarea 
                    value={projectDescription} 
                    onChange={(e) => setProjectDescription(e.target.value)} 
                    placeholder="Project Description"
                    className='text-black'
                    required 
                />
                <select 
                    value={selectedTeam} 
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className='text-black' 
                >
                    <option value="">Select Team (optional)</option>
                    {teams.map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                </select>
                <button type="submit">Create Project</button>
            </form>
        </div>
    );
};

export default Projects;
