import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ListEmpresa from '@/Components/Empresa/ListEmpresa';
import FilterEmpresa from '@/Components/Empresa/FilterEmpresa';
import CreateEmpresa from '@/Components/Empresa/CreateEmpresa';
export default function Index({ auth, empresas, filtroActual }) {

    return (
        <AuthenticatedLayout
            header={<div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Empresas</h2>
                        <p className="text-sm text-slate-400 mt-1 dark:text-slate-500">Gestión de empresas, información y estado.</p>
                    </div>
                    {auth.user.is_admin &&
                        <div className='w-50'>
                            <CreateEmpresa />
                        </div>
                    }
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
                    <ListEmpresa empresas={empresas} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}