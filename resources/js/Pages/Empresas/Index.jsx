import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ListEmpresa from '@/Components/Empresa/ListEmpresa';
import FilterEmpresa from '@/Components/Empresa/FiltEmpresa';

export default function Index({ empresasFiltradas, filtroActual }) {
    return (
        <AuthenticatedLayout
            header={<div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Empresas</h2>
                        <p className="text-sm text-slate-400 mt-1">Gestión de empresas, información y estado.</p>
                    </div>
                </div>}
        >
            <Head title="Empresas" />
            
            <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="w-full">
                    <FilterEmpresa 
                        filtroActual={filtroActual} 
                    />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full">
                    <ListEmpresa empresas={empresasFiltradas} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}