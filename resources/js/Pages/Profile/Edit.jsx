import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

/**
 * Renders the Edit profile page component
 * @param {Object} props - The component props
 * @param {boolean} props.mustVerifyEmail - Indicates if email verification is required
 * @param {string} props.status - The current status message
 * @returns {JSX.Element} The rendered Edit profile page component
 */
export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;

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
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-neutral-900 p-4 shadow sm:rounded-lg sm:p-8 flex justify-between items-center">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="w-4/6"
                        />
                            <img
                                src={auth.user?.img_profil ? `/img/${auth.user.img_profil}` : "https://via.placeholder.com/40"}
                                className="h-64 w-64 flex-shrink-0 rounded-full"
                                alt="Avatar"
                            />
                    </div>

                    <div className="bg-neutral-900 p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-background p-4 shadow sm:rounded-lg sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
