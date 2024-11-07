import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Show() {
    const { user } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-neutral-900 p-8 shadow sm:rounded-lg flex flex-col items-center">
                        <div className="w-48 h-48 border border-white rounded-full overflow-hidden">
                            <img
                                src={user.img_profile}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="mt-6 text-center">
                            <h3 className="text-2xl font-semibold text-white">
                                {user.name}
                            </h3>
                            <p className="text-gray-400">
                                Joined on 
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}