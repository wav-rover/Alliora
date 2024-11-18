import React, { useState } from 'react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Projects from '../Components/data/Projects';
import CreateProjects from '../Components/form/create-project';
import ProjectSearch from '@/Components/ui/project-search-modal';
import axios from 'axios';
import { SortAsc, SortDesc } from 'lucide-react';

const ProjectsPage = () => {
    const { teams, projects: initialProjects, adminTeams, tasks } = usePage().props;

    const [projects, setProjects] = useState(initialProjects);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('created_at'); // Tri par défaut
    const [sortOrder, setSortOrder] = useState('desc'); // Afficher les derniers créés en premier

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

    const sortedProjects = projects
    .filter((project) => {
        const projectNameMatch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
        const teamNameMatch = project.team?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        return projectNameMatch || teamNameMatch;
    })
    .sort((a, b) => {
        if (sortOption === 'name') {
            return sortOrder === 'asc'
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        } 
        return 0;
    });
    
    const handleSortByName = () => {
        setSortOption('name');
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };
    

    const filteredProjects = projects.filter((project) => {
        const projectNameMatch = project.name.toLowerCase().includes(searchTerm.toLowerCase());

        // On vérifie si le nom de l'équipe est défini et s'il correspond au terme de recherche
        const teamNameMatch = project.team?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;

        return projectNameMatch || teamNameMatch;
    });

    return (
        <AuthenticatedLayout>
            <Head title="Gérer les projets" />
            <ProjectSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            {/* Options de tri */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <button
                        onClick={handleSortByName}
                        className="flex items-center text-sm text-gray-700"
                    >
                        Order by name
                        {sortOption === 'name' && sortOrder === 'asc' ? (
                            <SortAsc className="w-4 h-4 ml-1" />
                        ) : (
                            <SortDesc className="w-4 h-4 ml-1" />
                        )}
                    </button>
                </div>
                <CreateProjects
                    adminTeams={adminTeams}
                    onProjectCreated={(projectData) => onProjectModified('create', projectData)}
                />
            </div>

            <div>
                {sortedProjects.length === 0 ? (
                    <p>Nothing here for now.</p>
                ) : (
                    <Projects
                        tasks={tasks}
                        projects={sortedProjects}
                        onProjectModified={onProjectModified}
                        adminTeams={adminTeams}
                        teams={teams}
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default ProjectsPage;