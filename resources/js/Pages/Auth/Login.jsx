import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Input } from '../../Components/ui/input2';
import { Label } from '../../Components/ui/label';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

/**
 * Renders a login form component with email and password inputs, remember me checkbox, and related functionality.
 * @param {Object} props - The component props
 * @param {string} props.status - The status message to display (if any)
 * @param {boolean} props.canResetPassword - Indicates if the password reset functionality is available
 * @returns {JSX.Element} A JSX element representing the login form
 */
export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = async (e) => {
        e.preventDefault();
    
        await post(route('login'), {
            onFinish: () => {
                // Rafraîchir le token CSRF après la connexion
                axios.get('/sanctum/csrf-cookie').then(response => {
                    // Le token CSRF est maintenant régénéré
                });
                
            },
        });
    };
    
    

    return (
        <GuestLayout>
            <Head title="Log in" />
            <h1 className="text-3xl font-bold text-white pb-6">Log in to your account!</h1>

            {status && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4 text-sm font-medium text-green-600"
                >
                    {status}
                </motion.div>
            )}

            <form onSubmit={submit}>
                <LabelInputContainer>
                    <Label htmlFor="email" value="Email">Email Address</Label>

                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <ErrorWithAnimation message={errors.email} />
                </LabelInputContainer>

                <LabelInputContainer>
                    <Label htmlFor="password" value="Password">Password</Label>

                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <ErrorWithAnimation message={errors.password} />
                </LabelInputContainer>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-slate-100">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="mt-4 flex items-center justify-end">

                    <Link
                        href={route('password.request')}
                        className="rounded-md text-sm text-white underline hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Forgot your password?
                    </Link>


                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex min-w-20 px-4 py-2 mt-2 ml-2 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] text-slate-400 transition-colors"
                    >
                        Log in
                    </motion.button>
                </div>
            </form>
        </GuestLayout>
    );
}

const ErrorWithAnimation = ({ message }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: message ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-2 text-red-600"
        >
            {message}
        </motion.div>
    );
};

const LabelInputContainer = ({ children }) => {
    return (
        <div className="flex flex-col space-y-2 w-full mb-2">
            {children}
        </div>
    );
};
