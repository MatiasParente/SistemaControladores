import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import StatCard from '@/Components/Declaracion/StatCard';
import { Briefcase, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import AttentionRequirement from '@/Components/Dashboard/AttentionRequirement';
import ProgressBar from '@/Components/Dashboard/ProgressBar';

export default function Dashboard({ atenciones, totalEmpresas, stats, total }) {
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
                    <StatCard label="Total Empresas" value={totalEmpresas || 0} icon={Briefcase} iconColor="text-blue-500" />
<StatCard label="Decl. Pendientes" value={stats?.pendientes || 0} icon={AlertCircle} iconColor="text-orange-500" />
<StatCard label="Decl. En Proceso" value={stats?.enProceso || 0} icon={RefreshCw} iconColor="text-yellow-500" />
<StatCard label="Decl. Finalizadas" value={stats?.finalizadas || 0} icon={CheckCircle2} iconColor="text-green-500" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className='mt-6'>
                        <ProgressBar stats={stats} total={total} />
                    </div>
                    <div className="mt-6">
                        <AttentionRequirement
                            atenciones={atenciones}
                        />
                    </div>
                </div>
                
        </AuthenticatedLayout>
    );
}
