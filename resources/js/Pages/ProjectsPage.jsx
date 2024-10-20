import React from 'react';
import Projects from '../Components/data/Projects';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const ProjectsPage = () => {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight">
                    Manage Projects
                </h2>
            }
        >
            <Head title="Manage Projects" />
            <div>
                <Projects />
            </div>
        </AuthenticatedLayout>
    );
};

export default ProjectsPage;
