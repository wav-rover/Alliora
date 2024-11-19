import { Head } from '@inertiajs/react';
import Sidebar from '../Components/ui/sidebar';
import { AuroraBackground } from '@/Components/ui/aurora-background';
import DropDownCustom from '@/Components/ui/drop-down-custom';
import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

const AuthenticatedLayout = ({ children }) => {
    const { auth } = usePage().props;
    const userId = auth.user.id;
    const [notifications, setNotifications] = useState(() => {
        // Restaurer les notifications depuis le stockage local
        const savedNotifications = localStorage.getItem('notifications');
        return savedNotifications ? JSON.parse(savedNotifications) : [];
    });

    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }, [notifications]);

    useEffect(() => {
        window.Echo.private(`notifications.${userId}`)
            .listen('.notification.sent', (data) => {
                console.log('Nouvelle notification reçue :', data);
                setNotifications((prevNotifications) => [...prevNotifications, data]);
            });

            return () => {
                window.Echo.leave(`notifications.${userId}`);
            };
    }, [userId]);

    return (
        <AuroraBackground>

            <div className="min-h-screen flex flex-col md:flex-row w-full backdrop-filter backdrop-blur-lg bg-opacity-40 bg-black">

                <div className="z-0 absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
                <Sidebar />
                <div className="flex-1 h-screen overflow-y-auto w-full relative md:flex-1 p-6">
                    <div className='text-white rounded-3xl p-6 rounded-3xl min-h-full'>
                        {children}
                    </div>
                </div>
            </div>
            <DropDownCustom notifications={notifications} />
        </AuroraBackground>
    );
};

export default AuthenticatedLayout;
