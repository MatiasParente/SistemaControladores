import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ListEmpresa from '@/Components/Empresa/ListEmpresa';
import FilterEmpresa from '@/Components/Empresa/FiltEmpresa';

export default function Index({ empresasFiltradas, filtroActual }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-bold text-white">Empresas</h2>}
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