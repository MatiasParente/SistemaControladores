import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ declaraciones }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-bold text-white">Declaraciones</h2>}
        >
            <Head title="Declaraciones" />

            <div className="bg-[#0B1121] p-6 rounded-2xl border border-gray-800">
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">Historial de Declaraciones</h3>
                <p className="text-gray-400">Aquí irá tu tabla para administrar las declaraciones fiscales y plantillas de Excel.</p>
                
                {/* Imprimimos temporalmente las declaraciones que vienen de la Base de Datos para verificar */}
                <div className="mt-4 p-4 bg-gray-900 rounded-xl border border-gray-800">
                    <p className="text-sm text-gray-500 mb-2">Datos recibidos desde la BD:</p>
                    <pre className="text-xs text-emerald-500 overflow-auto">
                        {JSON.stringify(declaraciones, null, 2)}
                    </pre>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
