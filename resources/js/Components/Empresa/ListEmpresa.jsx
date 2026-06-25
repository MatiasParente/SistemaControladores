import { useState } from 'react';
import { router, useForm, Link, usePage } from '@inertiajs/react';
import { Trash2, Edit, FileText, Check, X, Users, Clock, CheckCircle2, RefreshCw, XCircle, Calendar } from 'lucide-react';
import RelacionesModal from '@/Components/RelacionesModal';
import Mensaje from '@/Components/general/Mensaje';
import ConfirmModal from '@/Components/general/ConfirmModal';

export default function ListEmpresa({ empresas }) {
    // Estado para controlar qué fila está en modo edición
    const [editingId, setEditingId] = useState(null);

    const { flash } = usePage().props;

    // Estado para el modal de usuarios
    const [modalConfig, setModalConfig] = useState({ isOpen: false, url: '', title: '' });
    
    const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
    
    // obtener el usuario
    const user = usePage().props.auth.user;

    // para enviar y recibir los datos actualizados
    const { data, setData, post, processing, reset } = useForm({
        razonSocial: '',
        rut: '',
        direccion: '',
        logo: null,
        _method: 'put'
    });

    // Activar modo edición cargando los valores de la fila seleccionada
    const iniciarEdicion = (empresa) => {
        setEditingId(empresa.id);
        setData({
            razonSocial: empresa.razonSocial,
            rut: empresa.rut,
            direccion: empresa.direccion,
            logo: null,
            _method: 'put'
        });
    };

    // Cancelar edición y limpiar formulario
    const cancelarEdicion = () => {
        setEditingId(null);
        reset();
    };

    // Enviar los datos actualizados
    const guardarEdicion = (id) => {
        post(route('empresas.update', id), {
            onSuccess: () => setEditingId(null),
            forceFormData: true
        });
    };

    const eliminarEmpresa = (id) => {
        setConfirmConfig({
            isOpen: true,
            title: 'Eliminar Empresa',
            message: '¿Estás seguro de que deseas eliminar esta empresa? Esta acción no se puede deshacer.',
            onConfirm: () => {
                router.delete(route('empresas.destroy', id), {
                    onSuccess: () => {}
                });
            }
        }); 
};

    return (
        <div className="bg-gray-50 dark:bg-[#0B1121] p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-300">Empresas</h3>
                    <p className="text-sm text-slate-400">Listado de empresas registradas en el sistema.</p>
                </div>
            </div>

            {(!empresas || !empresas.data || empresas.data.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                    <Calendar className="w-12 h-12 mb-3 text-slate-600" />
                    <p className="text-sm">No tienes empresas asignadas.</p>
                </div>
            ) : (

            <div>
                <table className="w-full text-left border-collapse block md:table">
                    <thead className="hidden md:table-header-group">
                        <tr className="border-b border-gray-200 dark:border-gray-800 text-slate-400 text-xs font-semibold uppercase tracking-wider block md:table-row mb-4">
                            <th className="py-4 px-3">Logo</th>
                            <th className="py-4 px-3">Nombre</th>
                            <th className="py-4 px-3">RUT</th>
                            <th className="py-4 px-3">Dirección</th>
                            {user.is_admin && <th className="py-4 px-3">Usuarios</th>}
                            <th className="py-4 px-3 text-center">Resumen Declaraciones</th>
                            {user.is_admin && <th className="py-4 px-3 text-right">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody className="block md:table-row-group">
                        {empresas?.data?.map((empresa) => {
                            const isEditing = editingId === empresa.id;

                            return (
                                <tr key={empresa.id} className="bg-gray-50 dark:bg-[#070b14] md:bg-transparent rounded-2xl md:rounded-none p-4 md:p-0 border border-gray-200 dark:border-gray-800 md:border-none md:border-b md:border-gray-900/50 block md:table-row mb-4 md:mb-0 hover:bg-slate-100 dark:bg-slate-800/10 transition-colors">
                                    <td className="py-3 md:py-4 px-3 flex flex-col md:table-cell border-b border-gray-200 dark:border-gray-800/50 md:border-none gap-2 md:gap-0">
                                        <span className="md:hidden text-slate-500 text-xs uppercase font-semibold">Logo</span>
                                        <div className="w-12 h-12 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#070b14] flex items-center justify-center overflow-hidden shadow-inner relative group">
                                            {isEditing ? (
                                                <>
                                                    {empresa.logo && !data.logo ? (
                                                        <img 
                                                            src={empresa.logo} 
                                                            alt="Logo" 
                                                            className="w-full h-full object-cover opacity-50"
                                                        />
                                                    ) : data.logo ? (
                                                        <img 
                                                            src={URL.createObjectURL(data.logo)} 
                                                            alt="Logo preview" 
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-[10px] text-slate-600 font-medium uppercase">S/L</span>
                                                    )}
                                                    <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 cursor-pointer transition-opacity">
                                                        <Edit className="w-4 h-4 text-white" />
                                                        <input 
                                                            type="file" 
                                                            accept="image/*"
                                                            onChange={e => setData('logo', e.target.files[0])}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                </>
                                            ) : (
                                                empresa.logo ? (
                                                    <img 
                                                        src={empresa.logo} 
                                                        alt="Logo" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-[10px] text-slate-600 font-medium uppercase">S/L</span>
                                                )
                                            )}
                                        </div>
                                    </td>

                                    <td className="py-3 md:py-4 px-3 flex flex-col md:table-cell border-b border-gray-200 dark:border-gray-800/50 md:border-none gap-1 md:gap-0">
                                        <span className="md:hidden text-slate-500 text-xs uppercase font-semibold">Nombre</span>
                                        <div className="w-full">
                                            {isEditing ? (
                                                <input 
                                                    type="text"
                                                    value={data.razonSocial}
                                                    onChange={e => setData('razonSocial', e.target.value)}
                                                    className="w-full bg-white dark:bg-[#070b14] md:bg-gray-50 dark:bg-[#070b14] bg-slate-50 dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-slate-300 focus:outline-none focus:border-blue-500"
                                                />
                                            ) : (
                                                <div className="font-semibold text-slate-800 dark:text-slate-200">{empresa.razonSocial}</div>
                                            )}
                                        </div>
                                    </td>

                                    <td className="py-3 md:py-4 px-3 flex flex-col md:table-cell border-b border-gray-200 dark:border-gray-800/50 md:border-none gap-1 md:gap-0 text-slate-700 dark:text-slate-300">
                                        <span className="md:hidden text-slate-500 text-xs uppercase font-semibold">RUT</span>
                                        <div className="w-full">
                                            {isEditing ? (
                                                <input 
                                                    type="text"
                                                    value={data.rut}
                                                    onChange={e => setData('rut', e.target.value)}
                                                    className="w-full bg-white dark:bg-[#070b14] md:bg-gray-50 dark:bg-[#070b14] bg-slate-50 dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-slate-300 focus:outline-none focus:border-blue-500"
                                                />
                                            ) : (
                                                empresa.rut
                                            )}
                                        </div>
                                    </td>

                                    <td className="py-3 md:py-4 px-3 flex flex-col md:table-cell border-b border-gray-200 dark:border-gray-800/50 md:border-none gap-1 md:gap-0 text-slate-700 dark:text-slate-300">
                                        <span className="md:hidden text-slate-500 text-xs uppercase font-semibold">Dirección</span>
                                        <div className="w-full">
                                            {isEditing ? (
                                                <input 
                                                    type="text"
                                                    value={data.direccion}
                                                    onChange={e => setData('direccion', e.target.value)}
                                                    className="w-full bg-white dark:bg-[#070b14] md:bg-gray-50 dark:bg-[#070b14] bg-slate-50 dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-slate-300 focus:outline-none focus:border-blue-500"
                                                />
                                            ) : (
                                                empresa.direccion
                                            )}
                                        </div>
                                    </td>
                                    
                                    {user.is_admin && (
                                        <td className="py-3 md:py-4 px-3 flex flex-col md:table-cell border-b border-gray-200 dark:border-gray-800/50 md:border-none gap-2 md:gap-0 text-slate-700 dark:text-slate-300">
                                            <span className="md:hidden text-slate-500 text-xs uppercase font-semibold">Usuarios</span>
                                            <div className="w-full">
                                                {empresa.user?.length > 0 ? (
                                                    <div className="flex items-center">
                                                        <div 
                                                            tabIndex="0"
                                                            className="group relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 cursor-pointer md:cursor-help hover:bg-blue-500/20 transition-all duration-300 focus:outline-none"
                                                        >
                                                            <Users className="w-4 h-4" />
                                                            <span className="font-semibold text-sm whitespace-nowrap">
                                                                {empresa.user.length} {empresa.user.length === 1 ? 'Usuario' : 'Usuarios'}
                                                            </span>
                                                            
                                                            <div className="absolute top-full md:top-auto md:bottom-full left-0 md:left-1/2 md:-translate-x-1/2 mt-2 md:mb-2 md:mt-0 w-max max-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus:opacity-100 group-focus:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-300 z-50">
                                                                <div className="bg-slate-100 dark:bg-slate-800 border border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-xl py-2 px-3 shadow-xl">
                                                                    <div className="font-semibold mb-1 border-b border-slate-700 pb-1.5 text-slate-400">Usuarios Asignados</div>
                                                                    <ul className="text-left max-h-32 overflow-y-auto custom-scrollbar mt-1.5 space-y-1">
                                                                        {empresa.user.slice(0, 10).map((user, idx) => (
                                                                            <li key={user.id || idx} className="truncate text-slate-700 dark:text-slate-300">{user.name}</li>
                                                                        ))}
                                                                    </ul>
                                                                    {empresa.user.length > 10 && (
                                                                        <div className="mt-2 pt-2 border-t border-slate-700">
                                                                            <button 
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setModalConfig({ 
                                                                                        isOpen: true, 
                                                                                        url: `/empresas/${empresa.id}/usuarios`, 
                                                                                        title: `Usuarios de ${empresa.razonSocial}` 
                                                                                    });
                                                                                }}
                                                                                className="w-full text-center text-xs font-semibold text-blue-400 hover:text-blue-300 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
                                                                            >
                                                                                Ver todos ({empresa.user.length})
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="hidden md:block w-2.5 h-2.5 bg-slate-100 dark:bg-slate-800 border-b border-r border-slate-700 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                                                                <div className="md:hidden w-2.5 h-2.5 bg-slate-100 dark:bg-slate-800 border-t border-l border-slate-700 transform rotate-45 absolute -top-1 left-4"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800/40 text-slate-500 border border-slate-700/50 whitespace-nowrap">
                                                        <Users className="w-4 h-4 opacity-50" />
                                                        Ninguno
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    )}

                                    <td className="py-3 md:py-4 px-3 flex flex-col md:table-cell border-b border-gray-200 dark:border-gray-800/50 md:border-none gap-2 md:gap-0">
                                        <span className="md:hidden text-slate-500 text-xs uppercase font-semibold">Resumen Declaraciones</span>
                                        <div className="flex flex-wrap md:items-center md:justify-center gap-2">
                                            {empresa.en_pendiente_count > 0 && (
                                                <div className="group relative flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 cursor-help hover:bg-orange-500/20 transition-colors">
                                                    <Clock className="w-4 h-4" />
                                                    <span className="font-bold text-sm">{empresa.en_pendiente_count}</span>
                                                    <div className="absolute top-full md:top-auto md:bottom-full left-0 md:left-1/2 md:-translate-x-1/2 mt-2 md:mb-2 md:mt-0 w-max opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                                        <div className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl py-1.5 px-3 shadow-xl border border-slate-700">Pendientes</div>
                                                        <div className="hidden md:block w-2 h-2 bg-slate-100 dark:bg-slate-800 border-b border-r border-slate-700 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                                                        <div className="md:hidden w-2 h-2 bg-slate-100 dark:bg-slate-800 border-t border-l border-slate-700 transform rotate-45 absolute -top-1 left-4"></div>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {empresa.en_proceso_count > 0 && (
                                                <div className="group relative flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 cursor-help hover:bg-blue-500/20 transition-colors">
                                                    <RefreshCw className="w-4 h-4" />
                                                    <span className="font-bold text-sm">{empresa.en_proceso_count}</span>
                                                    <div className="absolute top-full md:top-auto md:bottom-full left-0 md:left-1/2 md:-translate-x-1/2 mt-2 md:mb-2 md:mt-0 w-max opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                                        <div className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl py-1.5 px-3 shadow-xl border border-slate-700">En Proceso</div>
                                                        <div className="hidden md:block w-2 h-2 bg-slate-100 dark:bg-slate-800 border-b border-r border-slate-700 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                                                        <div className="md:hidden w-2 h-2 bg-slate-100 dark:bg-slate-800 border-t border-l border-slate-700 transform rotate-45 absolute -top-1 left-4"></div>
                                                    </div>
                                                </div>
                                            )}

                                            {empresa.finalizadas_count > 0 && (
                                                <div className="group relative flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-help hover:bg-emerald-500/20 transition-colors">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span className="font-bold text-sm">{empresa.finalizadas_count}</span>
                                                    <div className="absolute top-full md:top-auto md:bottom-full left-0 md:left-1/2 md:-translate-x-1/2 mt-2 md:mb-2 md:mt-0 w-max opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                                        <div className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl py-1.5 px-3 shadow-xl border border-slate-700">Finalizadas</div>
                                                        <div className="hidden md:block w-2 h-2 bg-slate-100 dark:bg-slate-800 border-b border-r border-slate-700 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                                                        <div className="md:hidden w-2 h-2 bg-slate-100 dark:bg-slate-800 border-t border-l border-slate-700 transform rotate-45 absolute -top-1 left-4"></div>
                                                    </div>
                                                </div>
                                            )}

                                            {empresa.rechazadas_count > 0 && (
                                                <div className="group relative flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 cursor-help hover:bg-rose-500/20 transition-colors">
                                                    <XCircle className="w-4 h-4" />
                                                    <span className="font-bold text-sm">{empresa.rechazadas_count}</span>
                                                    <div className="absolute top-full md:top-auto md:bottom-full left-0 md:left-1/2 md:-translate-x-1/2 mt-2 md:mb-2 md:mt-0 w-max opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                                        <div className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-xl py-1.5 px-3 shadow-xl border border-slate-700">Rechazadas</div>
                                                        <div className="hidden md:block w-2 h-2 bg-slate-100 dark:bg-slate-800 border-b border-r border-slate-700 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                                                        <div className="md:hidden w-2 h-2 bg-slate-100 dark:bg-slate-800 border-t border-l border-slate-700 transform rotate-45 absolute -top-1 left-4"></div>
                                                    </div>
                                                </div>
                                            )}

                                            {empresa.finalizadas_count === 0 && 
                                            empresa.en_proceso_count === 0 && 
                                            empresa.rechazadas_count === 0 && 
                                            empresa.en_pendiente_count === 0 && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium bg-gray-100 dark:bg-slate-800/40 text-slate-500 border border-slate-700/50">
                                                    <FileText className="w-4 h-4 opacity-50" />
                                                    Sin decl.
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    {user.is_admin && (
                                        <td className="py-4 px-3 flex justify-end md:table-cell mt-2 md:mt-0">
                                            {isEditing ? (
                                                <div className="flex justify-end gap-2 w-full md:w-auto">
                                                    <button 
                                                        onClick={() => guardarEdicion(empresa.id)}
                                                        disabled={processing}
                                                        className="inline-flex flex-1 md:flex-none items-center justify-center p-2 md:p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
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
                                                    {/*Editar */}
                                                    <button 
                                                        onClick={() => iniciarEdicion(empresa)}
                                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800/50 md:bg-transparent rounded-lg p-2 md:p-1 text-slate-400 hover:text-blue-400 hover:bg-slate-100 dark:bg-slate-800"
                                                        title="Editar Empresa"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        <span className="md:hidden text-sm font-medium">Editar</span>
                                                    </button>

                                                    <button 
                                                        onClick={() => eliminarEmpresa(empresa.id)}
                                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800/50 md:bg-transparent rounded-lg p-2 md:p-1 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:bg-slate-800"
                                                        title="Eliminar Empresa"
                                                    >
                                                        <Trash2 className="w-5 h-5 md:w-4 md:h-4" />
                                                        <span className="md:hidden text-sm font-medium">Eliminar</span>
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                    </table>
                </div>
            )}
            
            <div className="flex items-center justify-between mt-6 px-2 w-full">
                <div>{/*Donde se muestra el boton de anterior */} 
                    {(() => {
                        
                        const firstLink = empresas?.links?.[0];
                        if (!firstLink) return null;
                        {/* Trraducimos boton de ingles al español y lo guardamos en un label */}
                        const label = 'Anterior';

                        if (!firstLink.url) {
                            return (
                                <span 
                                    className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800/20 text-slate-600 cursor-not-allowed border border-gray-200 dark:border-gray-800/40 select-none"
                                    dangerouslySetInnerHTML={{ __html: label }} 
                                />
                            );
                        }

                        return (
                            <Link
                                href={firstLink.url}
                                className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-700 hover:text-white border border-gray-300 dark:border-gray-700/30 transition-colors shadow-sm"
                                dangerouslySetInnerHTML={{ __html: label }}
                            />
                        );
                    })()}
                </div>
                    {/*Donde se muestran los numeros de la cantidad de paginas */}
                <div className="text-sm font-medium text-slate-400 select-none">
                    Página <span className="font-bold text-gray-800 dark:text-slate-200 mx-0.5">{empresas?.current_page}</span> de <span className="font-bold text-gray-800 dark:text-slate-200 mx-0.5">{empresas?.last_page}</span>
                </div>

                <div>{/*Donde se muestra el boton de siguiente */} 
                    {(() => {

                        const lastLink = empresas?.links?.[empresas.links.length - 1];
                        if (!lastLink) return null;

                        const label = 'Siguiente';

                        if (!lastLink.url) {
                            return (
                                <span 
                                    className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800/20 text-slate-600 cursor-not-allowed border border-gray-200 dark:border-gray-800/40 select-none"
                                    dangerouslySetInnerHTML={{ __html: label }} 
                                />
                            );
                        }

                        return (
                            <Link
                                href={lastLink.url}
                                className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-700 hover:text-white border border-gray-300 dark:border-gray-700/30 transition-colors shadow-sm"
                                dangerouslySetInnerHTML={{ __html: label }}
                            />
                        );
                    })()}
            </div>
        </div>
        <Mensaje mensaje={flash.message} />
        <RelacionesModal 
            isOpen={modalConfig.isOpen}
            onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
            url={modalConfig.url}
            title={modalConfig.title}
        />
        <ConfirmModal 
            isOpen={confirmConfig.isOpen}
            title={confirmConfig.title}
            message={confirmConfig.message}
            onConfirm={confirmConfig.onConfirm}
            onCancel={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        />
    </div>
    );
}