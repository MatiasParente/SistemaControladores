import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ users }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-bold text-white">Usuarios</h2>}
        >
            <Head title="Usuarios" />

            <div className="bg-[#0B1121] p-6 rounded-2xl border border-gray-800">
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">Administración de Usuarios</h3>
                <p className="text-gray-400">Aquí irá tu tabla para administrar usuarios administrativos del sistema.</p>
                
                {/* Imprimimos temporalmente los usuarios que vienen de la Base de Datos para verificar */}
                <div className="mt-4 p-4 bg-gray-900 rounded-xl border border-gray-800">
                    <p className="text-sm text-gray-500 mb-2">Datos recibidos desde la BD:</p>
                    <pre className="text-xs text-emerald-500 overflow-auto">
                        {JSON.stringify(users, null, 2)}
                    </pre>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
