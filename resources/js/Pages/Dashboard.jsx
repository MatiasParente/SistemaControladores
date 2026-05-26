import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import StatCard from '@/Components/Declaracion/StatCard';
import { AlertCircle } from 'lucide-react';
import AttentionRequirement from '@/Components/Dashboard/AttentionRequirement';
import ProgressBar from '@/Components/Dashboard/ProgressBar';

export default function Dashboard({declaraciones = [], empresas = [], stats, total}) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Principal</h2>
                        <p className="text-sm text-slate-400 mt-1">Resumen general</p>
                    </div>
                </div>
            }
        >
            <Head title="Principal" /> 


                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard label="Total Empresas" value={empresas.length} />
                    <StatCard label="Decl. Pendientes" value={stats?.pendientes || 0} icon={AlertCircle} />
                    <StatCard label="Decl. En Proceso" value={stats?.enProceso || 0} icon={AlertCircle} />
                    <StatCard label="Decl. Finalizadas" value={stats?.finalizadas || 0} icon={AlertCircle} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className='mt-6'>
                        <ProgressBar stats={stats} total={total} />
                    </div>
                    <div className="mt-6">
                        <AttentionRequirement
                            declaraciones={declaraciones}
                            empresas={empresas}
                        />
                    </div>
                </div>
                
        </AuthenticatedLayout>
    );
}
