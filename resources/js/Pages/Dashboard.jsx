import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import StatCard from '@/Components/Declaracion/StatCard';
import RecentDeclarations from '@/Components/Declaracion/RecentDeclarations';

export default function Dashboard({ declaracionesRecientes }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" /> 

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard label="Total Declaraciones" value="142" />
                            <StatCard label="Monto Procesado" value="$45.2k" />
                            <StatCard label="Pendientes" value="8" />
                        </div>

                        <RecentDeclarations declaraciones={declaracionesRecientes} />

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
