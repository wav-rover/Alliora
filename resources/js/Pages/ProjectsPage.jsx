import React, { useState } from 'react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Projects from '../Components/data/Projects';
import CreateProjects from '../Components/form/create-project';
import axios from 'axios';

const ProjectsPage = () => {
    const { teams } = usePage().props;
    const initialProjects = usePage().props.projects;
    const { adminTeams } = usePage().props;

    // État local pour les projets
    const [projects, setProjects] = useState(initialProjects);

    const reloadProjects = async () => {
        try {
            const response = await axios.get('/projects'); // Assurez-vous que cette route retourne la liste des projets avec les relations
            setProjects(response.data); // Mettre à jour l'état des projets avec les nouvelles données
        } catch (error) {
            console.error('Erreur lors du rechargement des projets :', error);
        }
    };
    

    // Gestion de la création, modification et suppression
    const onProjectModified = async (action, projectData) => {
        try {
            if (action === 'create') {
                const response = await axios.post('/projects', projectData);
                setProjects((prevProjects) => [...prevProjects, response.data]);
            } else if (action === 'edit') {
                await axios.put(`/projects/${projectData.id}`, projectData);
                setProjects((prevProjects) =>
                    prevProjects.map((project) =>
                        project.id === projectData.id ? { ...project, ...projectData } : project
                    )
                );
            } else if (action === 'delete') {
                await axios.delete(`/projects/${projectData.id}`);
                setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectData.id));
            }
        } catch (error) {
            console.error(`Erreur lors de la ${action} du projet :`, error);
        }
    };
    
    

    return (
        <AuthenticatedLayout>
            <Head title="Manage Projects" />
            <h1>Projects</h1>
            <CreateProjects adminTeams={adminTeams} onProjectCreated={(projectData) => onProjectModified('create', projectData)} />
            <div>
                {projects.length === 0 ? (
                    <p>No projects available.</p>
                ) : (
                    <Projects projects={projects} onProjectModified={onProjectModified} adminTeams={adminTeams} teams={teams} />
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default ProjectsPage;
