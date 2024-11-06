// src/Layouts/AuthenticatedLayout.jsx
import React from 'react';
import { Head } from '@inertiajs/react';
import Sidebar from '../Components/ui/sidebar';
import { AuroraBackground } from '@/Components/ui/aurora-background';
import DropDownCustom from '@/Components/ui/drop-down-custom';

const AuthenticatedLayout = ({ children }) => {
    return (
        <AuroraBackground>

            <div className="min-h-screen flex flex-col md:flex-row w-full backdrop-filter backdrop-blur-lg bg-opacity-40 bg-black">

                <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
                <Sidebar />

                <div className="flex-1 h-screen overflow-y-auto w-full relative md:flex-1 p-6">
                    <div className='text-white rounded-3xl p-6 rounded-3xl min-h-full'>
                        {children}
                        
            
                    </div>
                </div>
            </div>
            <DropDownCustom />
        </AuroraBackground>
    );
};

export default AuthenticatedLayout;
