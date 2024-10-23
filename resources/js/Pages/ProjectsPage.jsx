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
    const [searchTerm, setSearchTerm] = useState(''); // Ajout de l'état de recherche

    const onProjectModified = async (action, projectData) => {
        // Reste de la logique pour gérer création, modification et suppression...
    };

    // Filtrer les projets en fonction des termes de recherche
    const filteredProjects = projects.filter((project) => {
        const projectNameMatch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
        const teamNameMatch = project.team && project.team.name.toLowerCase().includes(searchTerm.toLowerCase());
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
