import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-[#070A13] text-gray-900 dark:text-gray-100 px-4 relative overflow-hidden">
            
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 mb-2">
                <Link href="/">
                    <ApplicationLogo className="h-16 w-16 fill-current text-white dark:text-gray-100 hover:text-emerald-400 transition-colors" />
                </Link>
            </div>

            <div className="relative z-10 mt-4 w-full sm:max-w-md overflow-hidden bg-white dark:bg-[#0e162b] border border-gray-200 dark:border-gray-800/80 px-8 py-8 shadow-2xl rounded-2xl">
                {children}
            </div>
        </div>
    );
}