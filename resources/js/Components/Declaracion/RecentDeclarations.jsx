import { useRef, useState, useEffect } from 'react'; 
import { Link, router } from '@inertiajs/react';
import { Calendar, Download, X, Trash2, RotateCcw } from 'lucide-react';

export default function RecentDeclarations({ declaraciones }) {
    const fileInputRef = useRef(null);
    const [uploadState, setUploadState] = useState({ declaracionId: null, tipo: null });

    const triggerUpload = (declId, tipo) => {
        setUploadState({ declaracionId: declId, tipo });
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
            fileInputRef.current.click();
        }
    };

    const subirArchivo = (e) => {
        const file = e.target.files[0];
        if (!file || !uploadState.declaracionId || !uploadState.tipo) return;
        const extensionesPermitidas = /(\.xlsx|\.xls)$/i;
        if (!extensionesPermitidas.exec(file.name)) {
            alert('Por favor, selecciona únicamente archivos de Excel (.xlsx o .xls)');
            e.target.value = null;
            return;
        }
        
        const formData = new FormData();
        formData.append('idDeclaracion', uploadState.declaracionId);
        formData.append('tipoPlantilla', uploadState.tipo);
        formData.append('archivo', file);
        
        router.post(route('plantillas.store'), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setUploadState({ declaracionId: null, tipo: null });
                alert('Archivo subido con éxito.');
            }
        });
    };

    const eliminarPlantilla = (idPlantilla, tipo) => {
        if (confirm(`¿Estás seguro de que deseas eliminar el archivo de ${tipo}?`)) {
            router.delete(route('plantillas.destroy', idPlantilla), {
                preserveScroll: true,
                onSuccess: () => alert('Archivo eliminado con éxito.')
            });
        }
    };
    
    const colorEstado = (statusName) => {
        if (statusName === 'Pendiente') {
            return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        }
        if (statusName === 'En Proceso') {
            return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        }
        if (statusName === 'Eliminado') {
            return 'bg-red-500/10 text-red-500 border-red-500/20';
        }
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    };

    const eliminar = (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta declaración fiscal? Si se encuentra en estado "Eliminado" se borrara permanentemente la declaracion, en otro caso solo se cambiara el estado.')) {
            router.delete(route('declaraciones.destroy', id), {
                onSuccess: () => alert('Declaración eliminada con éxito.')
            });
        }
    };

    const restaurarDeclaracion = (id) => {
        if (confirm('¿Estás seguro de que deseas restaurar esta declaración fiscal?')) {
            router.post(route('declaraciones.restaurar', id), {
                onSuccess: () => alert('Declaración restaurada con éxito.')
            });
        }
    };

    const getPlantillaByTipo = (plantillas, tipo) => {
        return plantillas.find(p => p.tipoPlantilla === tipo);
    };

    return (
        <div className="bg-gray-50 dark:bg-[#0B1121] p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Historial Fiscal</h3>
                    <p className="text-sm text-slate-400">Listado de declaraciones fiscales ingresadas en el sistema.</p>
                </div>
            </div>

            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                onChange={subirArchivo}
            />

            {(!declaraciones || !declaraciones.data || declaraciones.data.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                    <Calendar className="w-12 h-12 mb-3 text-slate-600" />
                    <p className="text-sm">No se encontraron declaraciones fiscales registradas.</p>
                    <p className="text-xs text-slate-600 mt-1">Utiliza el formulario de la derecha para registrar la primera.</p>
                </div>
            ) : (
                <div>
                    <table className="w-full text-left border-collapse block md:table">
                        <thead className="hidden md:table-header-group">
                            <tr className="border-b border-gray-200 dark:border-gray-800 text-slate-400 text-xs font-semibold uppercase tracking-wider block md:table-row mb-4">
                                <th className="py-4 px-3">Empresa</th>
                                <th className="py-4 px-3">Año Fiscal</th>
                                <th className="py-4 px-3">Estado</th>
                                <th className="py-4 px-3">Planillas</th>
                                <th className="py-4 px-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="block md:table-row-group">
                            {declaraciones.data.map((decl) => {
                                const fechaValida = decl.fechaFiscalInicio ? new Date(decl.fechaFiscalInicio) : null;
                                const anioFiscal = fechaValida && !isNaN(fechaValida) ? fechaValida.getUTCFullYear() : 'N/A';
                                
                                return (
                                    <tr key={decl.id} className="bg-gray-50 dark:bg-[#070b14] md:bg-transparent rounded-2xl md:rounded-none p-4 md:p-0 border border-gray-200 dark:border-gray-800 md:border-none md:border-b md:border-gray-900/50 block md:table-row mb-4 md:mb-0 hover:bg-slate-100 dark:bg-slate-800/10 transition-colors">
                                        <td className="py-3 md:py-4 px-3 flex flex-col md:table-cell border-b border-gray-200 dark:border-gray-800/50 md:border-none gap-1 md:gap-0">
                                            <span className="md:hidden text-slate-500 text-xs uppercase font-semibold">Empresa</span>
                                            <div>
                                                <div className="font-semibold text-slate-800 dark:text-slate-200">
                                                    {decl.empresa?.razonSocial || 'N/A'}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    RUT: {decl.empresa?.rut || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 md:py-4 px-3 flex flex-col md:table-cell border-b border-gray-200 dark:border-gray-800/50 md:border-none gap-1 md:gap-0 text-slate-700 dark:text-slate-300 font-medium">
                                            <span className="md:hidden text-slate-500 text-xs uppercase font-semibold">Año Fiscal</span>
                                            {anioFiscal}
                                        </td>
                                        <td className="py-3 md:py-4 px-3 flex flex-col md:table-cell border-b border-gray-200 dark:border-gray-800/50 md:border-none gap-2 md:gap-0">
                                            <span className="md:hidden text-slate-500 text-xs uppercase font-semibold">Estado</span>
                                            <div>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${colorEstado(decl.estado?.tipoEstado)}`}>
                                                    {decl.estado?.tipoEstado || 'Pendiente'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 md:py-4 px-3 flex flex-col md:table-cell border-b border-gray-200 dark:border-gray-800/50 md:border-none gap-2 md:gap-0">
                                            <span className="md:hidden text-slate-500 text-xs uppercase font-semibold">Planillas</span>
                                            <div className="flex flex-wrap gap-1.5 max-w-xs">
                                                {['Original', 'IRAE', 'Patrimonio', 'Balance'].map((tipo) => {
                                                    const pl = getPlantillaByTipo(decl.plantillas || [], tipo);
                                                    const labelMap = {
                                                        Original: 'Orig',
                                                        IRAE: 'IRAE',
                                                        Patrimonio: 'Patr',
                                                        Balance: 'Bal'
                                                    };
                                                    
                                                    if (pl) {
                                                        return (
                                                            <div key={tipo} className="relative group inline-block">
                                                                <a 
                                                                    href={route('plantillas.download', pl.id)}
                                                                    title={`Descargar planilla ${tipo}`}
                                                                    className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded text-[11px] font-semibold transition-colors"
                                                                >
                                                                    <Download className="w-2.5 h-2.5" />
                                                                    {labelMap[tipo]}
                                                                </a>
                                                                <button
                                                                    onClick={() => eliminarPlantilla(pl.id, tipo)}
                                                                    className="absolute -top-1.5 -right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                                    title={`Eliminar planilla ${tipo}`}
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        );
                                                    }
                                                    return (
                                                        <button 
                                                            key={tipo}
                                                            onClick={() => triggerUpload(decl.id, tipo)}
                                                            className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800/40 hover:bg-gray-200 text-slate-500 hover:text-slate-700 dark:text-slate-300 border border-gray-200 dark:border-gray-800/80 rounded text-[11px] cursor-pointer"
                                                            title={`Subir ${tipo}`}
                                                        >
                                                            {labelMap[tipo]}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                        <td className="py-4 px-3 flex justify-end md:table-cell mt-2 md:mt-0">
                                            <div className="flex justify-end items-center gap-3 w-full md:w-auto">
                                                {decl.estado?.tipoEstado === 'Eliminado' && (
                                                    <button
                                                        onClick={() => restaurarDeclaracion(decl.id)}
                                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-500/10 md:bg-transparent rounded-lg p-2 md:p-1 text-green-500 md:text-slate-400 hover:text-green-400 hover:bg-green-500/20 md:hover:bg-transparent transition-colors"
                                                        title="Restaurar declaración"
                                                    >
                                                        <RotateCcw className="w-4.5 h-4.5 md:w-5 md:h-5" />
                                                        <span className="md:hidden text-sm font-medium">Restaurar</span>
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => eliminar(decl.id)}
                                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-rose-500/10 md:bg-transparent rounded-lg p-2 md:p-1 text-rose-500 md:text-slate-400 hover:text-rose-500 hover:bg-rose-500/20 md:hover:bg-transparent transition-colors"
                                                    title="Eliminar declaración"
                                                >
                                                    <Trash2 className="w-4.5 h-4.5 md:w-5 md:h-5" />
                                                    <span className="md:hidden text-sm font-medium">Eliminar</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            
            {declaraciones?.data?.length > 0 && (
                <div className="flex items-center justify-between mt-6 px-2 w-full">
                    <div>
                        {(() => {
                            const firstLink = declaraciones?.links?.[0];
                            if (!firstLink) return null;
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
                    
                    <div className="text-sm font-medium text-slate-400 select-none">
                        Página <span className="font-bold text-gray-800 dark:text-slate-200 mx-0.5">{declaraciones?.current_page}</span> de <span className="font-bold text-gray-800 dark:text-gray-300 mx-0.5">{declaraciones?.last_page}</span>
                    </div>
                    
                    <div>
                        {(() => {
                            const lastLink = declaraciones?.links?.[declaraciones.links.length - 1];
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
            )}
        </div>
    );
}
