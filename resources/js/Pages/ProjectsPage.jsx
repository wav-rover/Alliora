import React, { useState } from 'react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Projects from '../Components/data/Projects';
import CreateProjects from '../Components/form/create-project';
import ProjectSearch from '@/Components/ui/project-search-modal';
import axios from 'axios';

const ProjectsPage = () => {
    const { teams } = usePage().props;
    const initialProjects = usePage().props.projects;
    const { adminTeams } = usePage().props;

    const [projects, setProjects] = useState(initialProjects);
    const [searchTerm, setSearchTerm] = useState(''); // État pour le terme de recherche

    const onProjectModified = async (action, projectData) => {
        try {
            if (action === 'create') {
                const response = await axios.post('/projects', projectData);
                const newProject = response.data;
                setProjects((prevProjects) => [...prevProjects, newProject]);
            } else if (action === 'edit') {
                const response = await axios.put(`/projects/${projectData.id}`, projectData);
                const updatedProject = response.data.project;
                setProjects((prevProjects) =>
                    prevProjects.map((project) =>
                        project.id === updatedProject.id ? updatedProject : project
                    )
                );
            } else if (action === 'delete') {
                await axios.delete(`/projects/${projectData.id}`);
                setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectData.id));
            }
        } catch (error) {
            console.error(`Error during ${action} of the project:`, error);
        }
    };

    // Filtrer les projets en fonction du terme de recherche
    const filteredProjects = projects.filter((project) => {
        const projectNameMatch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        // On vérifie si le nom de l'équipe est défini et s'il correspond au terme de recherche
        const teamNameMatch = project.team?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;

        return projectNameMatch || teamNameMatch;
    });

    return (
        <AuthenticatedLayout>
            <Head title="Manage Projects" />
            <ProjectSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            
            <div className='flex justify-end'>
                <CreateProjects adminTeams={adminTeams} onProjectCreated={(projectData) => onProjectModified('create', projectData)} />
            </div>
            <div>
                {filteredProjects.length === 0 ? (
                    <p>No projects available.</p>
                ) : (
                    <Projects projects={filteredProjects} onProjectModified={onProjectModified} adminTeams={adminTeams} teams={teams} />
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default ProjectsPage;
