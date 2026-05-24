import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Trash2, Edit, FileText, Check, X } from 'lucide-react';

export default function ListEmpresa({ empresas = [] }) {
    // Estado para controlar qué fila está en modo edición
    const [editingId, setEditingId] = useState(null);

    // para enviar y recibir los datos actualizados
    const { data, setData, put, processing, reset } = useForm({
        razonSocial: '',
        rut: '',
        direccion: ''
    });

    // Activar modo edición cargando los valores de la fila seleccionada
    const iniciarEdicion = (empresa) => {
        setEditingId(empresa.id);
        setData({
            razonSocial: empresa.razonSocial,
            rut: empresa.rut,
            direccion: empresa.direccion
        });
    };

    // Cancelar edición y limpiar formulario
    const cancelarEdicion = () => {
        setEditingId(null);
        reset();
    };

    // Enviar los datos actualizados
    const guardarEdicion = (id) => {
        put(route('empresas.update', id), {
            onSuccess: () => setEditingId(null)
        });
    };

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
                            <th className="py-4 px-3 text-center">Resumen Declaraciones</th>
                            <th className="py-4 px-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {empresas.map((empresa) => {
                            const isEditing = editingId === empresa.id;

                            return (
                                <tr key={empresa.id} className="hover:bg-slate-800/10 transition-colors border-b border-gray-900/50">
                                    <td className="py-4 px-3">
                                        <div className="w-12 h-12 rounded-xl border border-gray-800 bg-[#070b14] flex items-center justify-center overflow-hidden shadow-inner">
                                            {empresa.logo ? (
                                                <img 
                                                    src={`/storage/${empresa.logo}`} 
                                                    alt="Logo" 
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-[10px] text-slate-600 font-medium uppercase">S/L</span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="py-4 px-3">
                                        {isEditing ? (
                                            <input 
                                                type="text"
                                                value={data.razonSocial}
                                                onChange={e => setData('razonSocial', e.target.value)}
                                                className="w-full bg-[#070b14] border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
                                            />
                                        ) : (
                                            <div className="font-semibold text-slate-200">{empresa.razonSocial}</div>
                                        )}
                                    </td>

                                    <td className="py-4 px-3 text-slate-300">
                                        {isEditing ? (
                                            <input 
                                                type="text"
                                                value={data.rut}
                                                onChange={e => setData('rut', e.target.value)}
                                                className="w-full bg-[#070b14] border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
                                            />
                                        ) : (
                                            empresa.rut
                                        )}
                                    </td>

                                    <td className="py-4 px-3 text-slate-300">
                                        {isEditing ? (
                                            <input 
                                                type="text"
                                                value={data.direccion}
                                                onChange={e => setData('direccion', e.target.value)}
                                                className="w-full bg-[#070b14] border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
                                            />
                                        ) : (
                                            empresa.direccion
                                        )}
                                    </td>

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

                                            {empresa.finalizadas_count === 0 && 
                                             empresa.en_proceso_count === 0 && 
                                             empresa.rechazadas_count === 0 && 
                                             empresa.en_pendiente_count === 0 && (
                                                <span className="text-xs text-slate-500 italic">Sin declaraciones</span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="py-4 px-3 text-right">
                                        {isEditing ? (
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => guardarEdicion(empresa.id)}
                                                    disabled={processing}
                                                    className="inline-flex items-center justify-center p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                                                    title="Guardar Cambios"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={cancelarEdicion}
                                                    className="inline-flex items-center justify-center p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                                                    title="Cancelar"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end items-center gap-3">
                                                {/*Editar */}
                                                <button 
                                                    onClick={() => iniciarEdicion(empresa)}
                                                    className="text-slate-400 hover:text-blue-400 transition-colors p-1"
                                                    title="Editar Empresa"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>

                                                <button 
                                                    onClick={() => eliminarEmpresa(empresa.id)}
                                                    className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                                                    title="Eliminar Empresa"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}