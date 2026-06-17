import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import CreateDeclaracion from '@/Components/Declaracion/CreateDeclaracion';
import StatCard from '@/Components/Declaracion/StatCard';
import RecentDeclarations from '@/Components/Declaracion/RecentDeclarations';
import FilterDeclaracion from '@/Components/Declaracion/FilterDeclaracion';
import { FileText, TrendingUp, AlertCircle } from 'lucide-react';

export default function Index({ declaraciones = [], empresas = [], estados = [], stats, filtroActual, filtroActualEstado, filtroActualAño, aniosDisponibles = []}) {

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Declaraciones</h2>
                        <p className="text-sm text-slate-400 mt-1 dark:text-slate-500">Gestión de obligaciones (Empresa, Año Fiscal, Estado, Planillas).</p>
                    </div>
                </div>
            }
        >
            <Head title="Historial de Declaraciones" />

            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard label="Total Declaraciones" value={stats?.total || 0} icon={FileText} iconColor="text-blue-500"/>
                    <StatCard label="Finalizadas este Mes" value={stats?.finalizadas_mes || 0} icon={TrendingUp} iconColor="text-emerald-500"/>
                    <StatCard label="Pendientes" value={stats?.pendientes || 0} icon={AlertCircle} iconColor="text-red-500"/>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-6">
                        <FilterDeclaracion filtroActual={filtroActual} filtroActualEstado={filtroActualEstado} filtroActualAño={filtroActualAño} aniosDisponibles={aniosDisponibles} />
                        <RecentDeclarations declaraciones={declaraciones} />
                    </div>
                    <div className="w-full">
                        <CreateDeclaracion empresas={empresas} estados={estados} />
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
