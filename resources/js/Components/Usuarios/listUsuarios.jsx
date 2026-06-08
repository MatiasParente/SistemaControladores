import { useState } from 'react';
import { router, Link, useForm } from '@inertiajs/react';
import { Trash2, Edit, Check, X, Building2 } from 'lucide-react';

export default function ListUsuarios({ users }) { // Capitalizado por buena práctica de React
    const [editingId, setEditingId] = useState(null);

    // Formulario de Inertia para actualizar los datos
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        email: '',
        is_admin: false,
        _method: 'put'
    });

    // Activar modo edición cargando los valores de la fila seleccionada
    const iniciarEdicion = (usuario) => {
        setEditingId(usuario.id);
        setData({
            name: usuario.name,
            email: usuario.email,
            is_admin: usuario.is_admin ?? false, // Conserva el rol real del usuario
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
        <div className="bg-[#0B1121] p-6 rounded-3xl border border-gray-800 shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white">Usuarios</h3>
                    <p className="text-sm text-slate-400">Listado de usuarios registrados en el sistema.</p>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                            <th className="py-4 px-3">Nombre</th>
                            <th className="py-4 px-3">Correo</th>
                            <th className="py-4 px-3 text-center">Empresas asociadas</th>
                            <th className="py-4 px-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.data?.map((usuario) => {
                            const isEditing = editingId === usuario.id;

                            return (
                                <tr key={usuario.id} className="hover:bg-slate-800/10 transition-colors border-b border-gray-900/50">
                                    
                                    {/* Columna: Nombre (Corregida) */}
                                    <td className="py-4 px-3">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                className="w-full bg-[#070b14] border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
                                            />
                                        ) : (
                                            <div className="font-semibold text-slate-200">{usuario.name}</div>
                                        )}
                                    </td>

                                    {/* Columna: Correo (Corregida) */}
                                    <td className="py-4 px-3 text-slate-300">
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                                className="w-full bg-[#070b14] border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
                                            />
                                        ) : (
                                            <div className="text-slate-300">{usuario.email}</div>
                                        )}
                                    </td>

                                    {/* Columna: Empresas asociadas */}
                                    <td className="py-4 px-4">
                                        <div className="flex items-center justify-center gap-2">
                                            {usuario.empresas?.length > 0 ? (
                                                <div className="group relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-help hover:bg-emerald-500/20 transition-all duration-300">
                                                    <Building2 className="w-4 h-4" />
                                                    <span className="font-semibold text-sm">
                                                        {usuario.empresas.length} {usuario.empresas.length === 1 ? 'Empresa' : 'Empresas'}
                                                    </span>
                                                    
                                                    {/* Tooltip con nombres de empresas */}
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                                        <div className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl py-2 px-3 shadow-xl">
                                                            <div className="font-semibold mb-1 border-b border-slate-700 pb-1.5 text-slate-400">Empresas Asignadas</div>
                                                            <ul className="text-left max-h-32 overflow-y-auto custom-scrollbar mt-1.5 space-y-1">
                                                                {usuario.empresas.map((e, idx) => (
                                                                    <li key={e.id || idx} className="truncate text-slate-300">{e.razonSocial}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div className="w-2.5 h-2.5 bg-slate-800 border-b border-r border-slate-700 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium bg-slate-800/40 text-slate-500 border border-slate-700/50">
                                                    <Building2 className="w-4 h-4 opacity-50" />
                                                    Ninguna
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Columna: Acciones */}
                                    <td className="py-4 px-3 text-right">
                                        {isEditing ? (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => guardarEdicion(usuario.id)}
                                                    disabled={processing}
                                                    className="inline-flex items-center justify-center p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors disabled:opacity-50"
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
                                                <button
                                                    onClick={() => iniciarEdicion(usuario)}
                                                    className="text-slate-400 hover:text-blue-400 transition-colors p-1"
                                                    title="Editar Usuario"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => eliminarUsuario(usuario.id)}
                                                    className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                                                    title="Eliminar Usuario"
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
            
            {/* Paginación */}
            <div className="flex items-center justify-between mt-6 px-2 w-full">
                <div>
                    {(() => {
                        const firstLink = users?.links?.[0];
                        if (!firstLink) return null;
                        const label = 'Anterior';

                        if (!firstLink.url) {
                            return (
                                <span className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-slate-800/20 text-slate-600 cursor-not-allowed border border-gray-800/40 select-none">
                                    Anterior
                                </span>
                            );
                        }

                        return (
                            <Link
                                href={firstLink.url}
                                className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-slate-800/60 text-slate-300 hover:bg-slate-700 hover:text-white border border-gray-700/30 transition-colors shadow-sm"
                            >
                                {label}
                            </Link>
                        );
                    })()}
                </div>

                <div className="text-sm font-medium text-slate-400 select-none">
                    Página <span className="font-bold text-white mx-0.5">{users?.current_page}</span> de <span className="font-bold text-white mx-0.5">{users?.last_page}</span>
                </div>

                <div>
                    {(() => {
                        const lastLink = users?.links?.[users.links.length - 1];
                        if (!lastLink) return null;
                        const label = 'Siguiente';

                        if (!lastLink.url) {
                            return (
                                <span className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-slate-800/20 text-slate-600 cursor-not-allowed border border-gray-800/40 select-none">
                                    Siguiente
                                </span>
                            );
                        }

                        return (
                            <Link
                                href={lastLink.url}
                                className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-slate-800/60 text-slate-300 hover:bg-slate-700 hover:text-white border border-gray-700/30 transition-colors shadow-sm"
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