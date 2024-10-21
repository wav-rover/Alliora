import React, { useState } from 'react';
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";

const CreateProjectForm = ({ teams, onProjectCreated }) => {
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [selectedTeam, setSelectedTeam] = useState('');

    // Soumission du formulaire en appelant onProjectCreated avec les données du projet
    const handleSubmit = async (e) => {
        e.preventDefault();
        const projectData = {
            name: projectName,
            description: projectDescription,
            team_id: selectedTeam,
        };
        try {
            await onProjectCreated(projectData); // Utilise la fonction passée en props
            setProjectName(''); // Réinitialiser le formulaire après la création
            setProjectDescription('');
            setSelectedTeam('');
        } catch (error) {
            console.error('Erreur lors de la création du projet :', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <Input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Project Name"
                required
            />
            <Input
                type="text"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Project Description"
                required
            />
            <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="border rounded p-2"
            >
                <option value="">Select a Team</option>
                {teams.length > 0 ? (
                    teams.map((team) => (
                        <option key={team.id} value={team.id}>
                            {team.name}
                        </option>
                    ))
                ) : (
                    <option disabled>No teams available</option>
                )}
            </select>
            <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Create Project
            </Button>
        </form>
    );
};

export default CreateProjectForm;
