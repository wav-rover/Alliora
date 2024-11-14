import React from 'react';
import Teams from '../Components/data/Teams'; // Assurez-vous que ce composant affiche bien les équipes
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import AddTeam from '@/Components/form/add-teams';

const TeamsPage = ({ teams }) => {
    return (
        <AuthenticatedLayout>
            <Head title="Manage Teams" />
            <h1 className='text-3xl'>Manage your <span className='rounded-md bg-neutral-800 bg-opacity-20 pt-3 pb-1 px-1'><span className="bg-gradient-to-r from-slate-400 via-white to-black-300 text-transparent bg-clip-text text-5xl font-bold drop-shadow-[0_0_10px_rgba(200,255,255,0.3)]">
                Teams
            </span></span></h1>
            <div>
                <Teams teams={teams} />
            </div>
        </AuthenticatedLayout>
    );
};

export default TeamsPage;
