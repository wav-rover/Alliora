import React, { useState } from 'react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Projects from '../Components/data/Projects';
import CreateProjects from '../Components/form/create-project';
import axios from 'axios';

const ProjectsPage = () => {
    const { teams } = usePage().props;
    const initialProjects = usePage().props.projects;

    // État local pour les projets
    const [projects, setProjects] = useState(initialProjects);

    // Fonction pour mettre à jour la liste des projets
    const fetchProjects = async () => {
        try {
            const response = await axios.get('/projects');
            // Vérifie que la réponse est bien un tableau, sinon, setProjects([]) pour éviter l'erreur
            setProjects(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Erreur lors de la récupération des projets :', error);
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
            <CreateProjects teams={teams} onProjectCreated={(projectData) => onProjectModified('create', projectData)} />
            <div>
                {projects.length === 0 ? (
                    <p>No projects available.</p>
                ) : (
                    <Projects projects={projects} onProjectModified={onProjectModified} />
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default ProjectsPage;
