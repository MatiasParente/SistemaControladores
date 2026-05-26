import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import CreateDeclaracion from '@/Components/Declaracion/CreateDeclaracion';
import StatCard from '@/Components/Declaracion/StatCard';
import RecentDeclarations from '@/Components/Declaracion/RecentDeclarations';
import FilterDeclaracion from '@/Components/Declaracion/FilterDeclaracion';
import { FileSpreadsheet, Trash2, Calendar, Download, FileText, TrendingUp, AlertCircle } from 'lucide-react';

export default function Index({ declaraciones = [], empresas = [], estados = [], stats, filtroActual, filtroActualEstado, filtroActualAño}) {
    
    const getStatusColor = (statusName) => {
        if (statusName === 'Pendiente') {
            return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        }
        if (statusName === 'En Proceso') {
            return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        }
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta declaración fiscal? Se borrarán también todos sus archivos asociados.')) {
            router.delete(route('declaraciones.destroy', id), {
                onSuccess: () => alert('Declaración eliminada con éxito.')
            });
        }
    };

    const getPlantillaByTipo = (plantillas, tipo) => {
        return plantillas.find(p => p.tipoPlantilla === tipo);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Declaraciones</h2>
                        <p className="text-sm text-slate-400 mt-1">Gestión de obligaciones (Empresa, Año Fiscal, Estado, Planillas).</p>
                    </div>
                </div>
            }
        >
            <Head title="Historial de Declaraciones" />

            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard label="Total Declaraciones" value={stats?.total || 0} icon={FileText} />
                    <StatCard label="Finalizadas este Mes" value={stats?.finalizadas_mes || 0} icon={TrendingUp} />
                    <StatCard label="Pendientes" value={stats?.pendientes || 0} icon={AlertCircle} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-6">
                        <FilterDeclaracion 
                        filtroActual={filtroActual} 
                        filtroActualEstado={filtroActualEstado} 
                        filtroActualAño={filtroActualAño} />
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
