import React from 'react';
import Teams from '../Components/data/Teams'; // Assurez-vous que ce composant affiche bien les équipes
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import AddTeam from '@/Components/ui/add-teams';

const TeamsPage = ({ teams }) => { // Recevez les équipes comme props
    return (
        <AuthenticatedLayout>
            <Head title="Manage Teams" />
            <div>
                <Teams teams={teams} /> {/* Passez les équipes au composant Teams */}
            </div>
        </AuthenticatedLayout>
    );
};

export default TeamsPage;
