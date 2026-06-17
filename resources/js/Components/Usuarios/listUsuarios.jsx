import { useState } from 'react';
import { router, Link, useForm } from '@inertiajs/react';
import { Trash2, Edit, Check, X, Building2 } from 'lucide-react';
import SelectEmpresa from '@/Components/Usuarios/SelectEmpresa';

export default function ListUsuarios({ users, empresas = [] }) {
    const [editingId, setEditingId] = useState(null);

    // Formulario de Inertia para actualizar los datos
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        email: '',
        is_admin: false,
        empresas_ids: [],
        _method: 'put'
    });

    // Activar modo edición cargando los valores de la fila seleccionada
    const iniciarEdicion = (usuario) => {
        setEditingId(usuario.id);
        setData({
            name: usuario.name,
            email: usuario.email,
            is_admin: usuario.is_admin ?? false, // Conserva el rol real del usuario
            empresas_ids: usuario.empresas ? usuario.empresas.map(e => e.id) : [],
            _method: 'put'
        });
    };

    // Cancelar edición y limpiar formulario
    const cancelarEdicion = () => {
        setEditingId(null);
        reset();
    };

    // Enviar los datos actualizados mediante POST simulando PUT
    const guardarEdicion = (id) => {
        post(route('usuarios.update', id), {
            onSuccess: () => setEditingId(null),
            forceFormData: true
        });
    };

    const eliminarUsuario = (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            router.delete(route('usuarios.destroy', id), {
                onSuccess: () => {
                    alert('Usuario eliminado con éxito.');
                }
            });
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-[#0B1121] p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-300">Usuarios</h3>
                    <p className="text-sm text-slate-400">Listado de usuarios registrados en el sistema.</p>
                </div>
            </div>
            
            <div>
                <table className="w-full text-left border-collapse block md:table">
                    <thead className="hidden md:table-header-group">
                        <tr className="border-b border-gray-200 dark:border-gray-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                            <th className="py-4 px-3">Nombre</th>
                            <th className="py-4 px-3">Correo</th>
                            <th className="py-4 px-3 text-center">Empresas asociadas</th>
                            <th className="py-4 px-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="block md:table-row-group mb-4">
                        {users?.data?.map((usuario) => {
                            const isEditing = editingId === usuario.id;

                            return (
                                <tr key={usuario.id} className="bg-gray-50 dark:bg-[#070b14] md:bg-transparent rounded-2xl md:rounded-none p-4 md:p-0 border border-gray-200 dark:border-gray-800 md:border-none md:border-b md:border-gray-900/50 block md:table-row mb-4 md:mb-0 hover:bg-slate-100 dark:bg-slate-800/10 transition-colors">
                                    
                                    {/* Nombre */}
                                    <td className="py-3 md:py-4 px-3 flex flex-col md:table-cell border-b border-gray-200 dark:border-gray-800/50 md:border-none gap-1 md:gap-0">
                                        <span className="md:hidden text-slate-500 text-xs uppercase font-semibold">Nombre</span>
                                        <div className="w-full">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={data.name}
                                                    onChange={e => setData('name', e.target.value)}
                                                    className="w-full bg-gray-50 dark:bg-[#070b14] border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-slate-300 focus:outline-none focus:border-blue-500"
                                                />
                                            ) : (
                                                <div className="font-semibold text-slate-800 dark:text-slate-200">{usuario.name}</div>
                                            )}
                                        </div>
                                    </td>

                                    {/* Correo */}
                                    <td className="py-3 md:py-4 px-3 flex flex-col md:table-cell border-b border-gray-200 dark:border-gray-800/50 md:border-none gap-1 md:gap-0 text-slate-700 dark:text-slate-300">
                                        <span className="md:hidden text-slate-500 text-xs uppercase font-semibold">Correo</span>
                                        <div className="w-full">
                                            {isEditing ? (
                                                <input
                                                    type="email"
                                                    value={data.email}
                                                    onChange={e => setData('email', e.target.value)}
                                                    className="w-full bg-gray-50 dark:bg-[#070b14] border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-slate-300 focus:outline-none focus:border-blue-500"
                                                />
                                            ) : (
                                                <div className="text-slate-700 dark:text-slate-300">{usuario.email}</div>
                                            )}
                                        </div>
                                    </td>

                                    {/* empresas asociadas */}
                                    <td className="py-3 md:py-4 px-3 flex flex-col md:table-cell border-b border-gray-200 dark:border-gray-800/50 md:border-none gap-1 md:gap-0">
                                        <span className="md:hidden text-slate-500 text-xs uppercase font-semibold">Empresas asociadas</span>
                                        <div className="flex md:items-center md:justify-center w-full">
                                            {isEditing ? (
                                                <div className="w-full">
                                                    <SelectEmpresa
                                                        empresasDisponibles={empresas}
                                                        selectedIds={data.empresas_ids}
                                                        onChange={ids => setData('empresas_ids', ids)}
                                                    />
                                                </div>
                                            ):(
                                                usuario.empresas?.length > 0 ? (
                                                    <div className="group relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-help hover:bg-emerald-500/20">
                                                        <Building2 className="w-4 h-4" />
                                                        <span className="font-semibold text-sm">
                                                            {usuario.empresas.length} {usuario.empresas.length === 1 ? 'Empresa' : 'Empresas'}
                                                        </span>
                                                        
                                                        <div className="absolute bottom-full md:bottom-full left-0 md:left-1/2 md:-translate-x-1/2 mt-2 md:mb-2 md:mt-0 w-max max-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50">
                                                            <div className="bg-slate-100 dark:bg-slate-800 border border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-xl py-2 px-3 shadow-xl">
                                                                <div className="font-semibold mb-1 border-b border-slate-700 pb-1.5 text-slate-400">Empresas Asignadas</div>
                                                                <ul className="text-left max-h-32 overflow-y-auto custom-scrollbar mt-1.5 space-y-1">
                                                                    {usuario.empresas.map((e, idx) => (
                                                                        <li key={e.id || idx} className="truncate text-slate-700 dark:text-slate-300">{e.razonSocial}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                            <div className="hidden md:block w-2.5 h-2.5 bg-slate-100 dark:bg-slate-800 border-b border-r border-slate-700 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                                                            <div className="md:hidden w-2.5 h-2.5 bg-slate-100 dark:bg-slate-800 border-t border-l border-slate-700 transform rotate-45 absolute -top-1 left-4"></div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800/40 text-slate-500 border border-slate-700/50">
                                                        <Building2 className="w-4 h-4 opacity-50" />
                                                        Ninguna
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </td>

                                    {/* acciones */}
                                    <td className="py-4 px-3 flex justify-end md:table-cell mt-2 md:mt-0">
                                        {isEditing ? (
                                            <div className="flex justify-end gap-2 w-full md:w-auto">
                                                <button
                                                    onClick={() => guardarEdicion(usuario.id)}
                                                    disabled={processing}
                                                    className="inline-flex flex-1 md:flex-none items-center justify-center p-2 md:p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50"
                                                    title="Guardar Cambios"
                                                >
                                                    <Check className="w-4 h-4 mr-2 md:mr-0" />
                                                    <span className="md:hidden text-sm font-medium">Guardar</span>
                                                </button>
                                                <button
                                                    onClick={cancelarEdicion}
                                                    className="inline-flex flex-1 md:flex-none items-center justify-center p-2 md:p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                                                    title="Cancelar"
                                                >
                                                    <X className="w-4 h-4 mr-2 md:mr-0" />
                                                    <span className="md:hidden text-sm font-medium">Cancelar</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end items-center gap-3 w-full md:w-auto">
                                                <button
                                                    onClick={() => iniciarEdicion(usuario)}
                                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800/50 md:bg-transparent rounded-lg p-2 md:p-1 text-slate-400 hover:text-blue-400 hover:bg-slate-100 dark:bg-slate-800"
                                                    title="Editar Usuario"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                    <span className="md:hidden text-sm font-medium">Editar</span>
                                                </button>
                                                <button
                                                    onClick={() => eliminarUsuario(usuario.id)}
                                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800/50 md:bg-transparent rounded-lg p-2 md:p-1 text-rose-500 md:text-slate-400 hover:text-rose-500 hover:bg-rose-500/20 md:hover:bg-transparent"
                                                    title="Eliminar Usuario"
                                                >
                                                    <Trash2 className="w-5 h-5 md:w-4 md:h-4" />
                                                    <span className="md:hidden text-sm font-medium">Eliminar</span>
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
            
            {/* paginación */}
            <div className="flex items-center justify-between mt-6 px-2 w-full">
                <div>
                    {(() => {
                        const firstLink = users?.links?.[0];
                        if (!firstLink) return null;
                        const label = 'Anterior';

                        if (!firstLink.url) {
                            return (
                                <span className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800/20 text-slate-600 cursor-not-allowed border border-gray-200 dark:border-gray-800/40 select-none">
                                    Anterior
                                </span>
                            );
                        }

                        return (
                            <Link
                                href={firstLink.url}
                                className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-700 hover:text-white border border-gray-300 dark:border-gray-700/30 transition-colors shadow-sm"
                            >
                                {label}
                            </Link>
                        );
                    })()}
                </div>

                <div className="text-sm font-medium text-slate-400 select-none">
                    Página <span className="font-bold text-slate-800 dark:text-slate-200 mx-0.5">{users?.current_page}</span> de <span className="font-bold text-slate-800 dark:text-slate-200 mx-0.5">{users?.last_page}</span>
                </div>

                <div>
                    {(() => {
                        const lastLink = users?.links?.[users.links.length - 1];
                        if (!lastLink) return null;
                        const label = 'Siguiente';

                        if (!lastLink.url) {
                            return (
                                <span className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800/20 text-slate-600 cursor-not-allowed border border-gray-200 dark:border-gray-800/40 select-none">
                                    Siguiente
                                </span>
                            );
                        }

                        return (
                            <Link
                                href={lastLink.url}
                                className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-700 hover:text-white border border-gray-300 dark:border-gray-700/30 transition-colors shadow-sm"
                            >
                                {label}
                            </Link>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
}