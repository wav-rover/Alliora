import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="flex min-h-30  flex-col items-center bg-black sm:justify-center sm:pt-0  ">
            <div className=" w-full  bg-black px-6 py-6 shadow-md sm:max-w-md border border-zinc-800 rounded-lg">
                {children}
            </div>
        </div>
    );
}
