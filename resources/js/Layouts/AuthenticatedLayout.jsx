// src/Layouts/AuthenticatedLayout.jsx
import React from 'react';
import { Head } from '@inertiajs/react';
import Sidebar from '../Components/ui/sidebar';

const AuthenticatedLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <Sidebar />
            <div className="flex-1 h-screen overflow-y-auto w-full relative md:flex-1 p-6">
                <Head title="My Application" />
                {children}
            </div>
        </div>
    );
};

export default AuthenticatedLayout;
