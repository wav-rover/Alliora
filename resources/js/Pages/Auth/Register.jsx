import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Input } from '../../Components/ui/input2';
import { Label } from '../../Components/ui/label';
import { motion } from 'framer-motion';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = async (e) => {
        e.preventDefault();

        await post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />
            <h1 className="text-3xl font-bold text-white pb-6">Create an account!</h1>
            <form onSubmit={submit}>
                <LabelInputContainer>
                    <Label htmlFor="name" value="Name">Name</Label>

                    <Input
                        id="name"
                        name="name"
                        value={data.name}
                        className="block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <ErrorWithAnimation message={errors.name} />
                </LabelInputContainer>

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
                        required
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
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <ErrorWithAnimation message={errors.password} />
                </LabelInputContainer>

                <LabelInputContainer>
                    <Label htmlFor="password_confirmation" value="Confirm Password">Confirm Password</Label>

                    <Input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />

                    <ErrorWithAnimation message={errors.password_confirmation} />
                </LabelInputContainer>

                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="text-sm text-white underline hover:text-slate-200"
                    >
                        Already registered?
                    </Link>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex min-w-20 px-4 py-2 mt-2 ml-2 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] text-slate-400 transition-colors"
                        disabled={processing}
                    >
                        Register
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
