import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ListUser from '@/Components/Usuarios/listUsuarios';
import FilterUser from '@/Components/Usuarios/FilterUser';

export default function Index({ users, empresas, filtroActual, filtroActualEmpresa }) {
    return (
        <AuthenticatedLayout
            header={<div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Usuarios</h2>
                        <p className="text-sm text-slate-400 mt-1">Gestión de usuarios.</p>
                    </div>
                </div>}
        >
            <Head title="Usuarios" />
            
            <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="w-full">
                    <FilterUser 
                        empresas={empresas}
                        filtroActual={filtroActual} 
                        filtroActualEmpresa={filtroActualEmpresa} 
                    />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full">
                    <ListUser users={users} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}