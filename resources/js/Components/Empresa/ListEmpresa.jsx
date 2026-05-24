import { router } from '@inertiajs/react';
import { Trash2, Edit, FileText } from 'lucide-react';

export default function ListEmpresa({ empresas = [] }) {

    const eliminarEmpresa = (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta empresa?')) {
            router.delete(route('empresas.destroy', id), {
                onSuccess: () => alert('Empresa eliminada con éxito.')
            }); 
        }   
    };

    return (
        <div className="bg-[#0B1121] p-6 rounded-3xl border border-gray-800 shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white">Empresas</h3>
                    <p className="text-sm text-slate-400">Listado de empresas registradas en el sistema.</p>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                            <th className="py-4 px-3">Logo</th>
                            <th className="py-4 px-3">Nombre</th>
                            <th className="py-4 px-3">RUT</th>
                            <th className="py-4 px-3">Dirección</th>
                            <th className="py-4 px-3">Resumen Declaraciones</th>
                            <th className="py-4 px-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {empresas.map((empresa) => (
                            <tr key={empresa.id} className="hover:bg-slate-800/10 transition-colors">
                                <td className="w-12 h-12 rounded-full object-cover"> {empresa.logo} </td>
                                <td className="py-4 px-3">
                                    <div className="font-semibold text-slate-200">{empresa.razonSocial}</div>
                                </td>
                                <td className="py-4 px-3 text-slate-300">{empresa.rut}</td>
                                <td className="py-4 px-3 text-slate-300">{empresa.direccion}</td>
                                <td className="py-4 px-4">
                                <div className="flex items-center justify-center gap-2">
                                    
                                    {empresa.en_pendiente_count > 0 && (
                                        <span title="Pendientes" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-semibold bg-yellow-950/50 text-yellow-400 border border-yellow-500/30">
                                            <FileText className="w-4 h-4" /> {empresa.en_pendiente_count}
                                        </span>
                                    )}
                                    
                                    {empresa.finalizadas_count > 0 && (
                                        <span title="Finalizadas" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-semibold bg-emerald-950/50 text-emerald-400 border border-emerald-500/30">
                                            <FileText className="w-4 h-4" /> {empresa.finalizadas_count}
                                        </span>
                                    )}

                                    {empresa.en_proceso_count > 0 && (
                                        <span title="En Proceso" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-semibold bg-blue-950/50 text-blue-400 border border-blue-500/30">
                                            <FileText className="w-4 h-4" /> {empresa.en_proceso_count}
                                        </span>
                                    )}

                                    {empresa.rechazadas_count > 0 && (
                                        <span title="Rechazadas" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-semibold bg-rose-950/50 text-rose-400 border border-rose-500/30">
                                            <FileText className="w-4 h-4" /> {empresa.rechazadas_count}
                                        </span>
                                    )}

                                    {/* si la empresa no tiene ninguna declaración cargada */}
                                    {empresa.finalizadas_count === 0 && 
                                     empresa.en_proceso_count === 0 && 
                                     empresa.rechazadas_count === 0 && 
                                     empresa.en_pendiente_count === 0 && (
                                        <span className="text-xs text-slate-500 italic">Sin declaraciones</span>
                                    )}
                                    
                                </div>
                            </td>
                                <td className="py-4 px-3">
                                    <button 
                                        onClick={() => eliminarEmpresa(empresa.id)}
                                        className="text-white-400 hover:text-white-500 transition-colors"
                                        title="Eliminar Empresa"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => editarEmpresa(empresa.id)}
                                        className="text-white-400 hover:text-white-500 transition-colors"
                                        title="Editar Empresa"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}