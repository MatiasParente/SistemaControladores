import { Trash2, Calendar, Download, X } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function RecentDeclarations({ declaraciones = [] }) {
    const fileInputRef = useRef(null);
    const [uploadState, setUploadState] = useState({ declaracionId: null, tipo: null });

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.max(1, Math.ceil(declaraciones.length / itemsPerPage));
    const currentDeclaraciones = declaraciones.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const triggerUpload = (declId, tipo) => {
        setUploadState({ declaracionId: declId, tipo });
        if (fileInputRef.current) {
            fileInputRef.current.value = null; // reset
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file || !uploadState.declaracionId || !uploadState.tipo) return;
        
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

    const handleDeletePlantilla = (idPlantilla, tipo) => {
        if (confirm(`¿Estás seguro de que deseas eliminar el archivo de ${tipo}?`)) {
            router.delete(route('plantillas.destroy', idPlantilla), {
                preserveScroll: true,
                onSuccess: () => alert('Archivo eliminado con éxito.')
            });
        }
    };
    
    const getStatusColor = (statusName) => {
        if (statusName === 'Pendiente') {
            return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        }
        if (statusName === 'En Proceso') {
            return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        }
        if (statusName === 'Rechazada') {
            return 'bg-red-500/10 text-red-500 border-red-500/20';
        }
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta declaración fiscal? Se borrarán también todos sus archivos asociados.')) {
            router.delete(route('declaraciones.destroy', id), {
                onSuccess: () => alert('Declaración eliminada con éxito.')
            });
        }
    };

    const getPlantillaByTipo = (plantillas, tipo) => {
        return plantillas.find(p => p.tipoPlantilla === tipo);
    };

    return (
        <div className="bg-[#0B1121] p-6 rounded-3xl border border-gray-800 shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white">Historial Fiscal</h3>
                    <p className="text-sm text-slate-400">Listado de declaraciones fiscales ingresadas en el sistema.</p>
                </div>
            </div>

            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange} 
            />

            {declaraciones.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500 border border-dashed border-gray-800 rounded-2xl">
                    <Calendar className="w-12 h-12 mb-3 text-slate-600" />
                    <p className="text-sm">No se encontraron declaraciones fiscales registradas.</p>
                    <p className="text-xs text-slate-600 mt-1">Utiliza el formulario de la derecha para registrar la primera.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                <th className="py-4 px-3">Empresa</th>
                                <th className="py-4 px-3">Año Fiscal</th>
                                <th className="py-4 px-3">Estado</th>
                                <th className="py-4 px-3">Planillas</th>
                                <th className="py-4 px-3 text-right"> </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                            {currentDeclaraciones.map((decl) => {
                                const anioFiscal = new Date(decl.fechaFiscalInicio).getFullYear();
                                
                                return (
                                    <tr key={decl.id} className="hover:bg-slate-800/10 transition-colors">
                                        <td className="py-4 px-3">
                                            <div className="font-semibold text-slate-200">
                                                {decl.empresa?.razonSocial || 'N/A'}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                RUT: {decl.empresa?.rut || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="py-4 px-3 text-slate-300 font-medium">
                                            {anioFiscal}
                                        </td>
                                        <td className="py-4 px-3">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(decl.estado?.tipoEstado)}`}>
                                                {decl.estado?.tipoEstado || 'Pendiente'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-3">
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
                                                                    onClick={() => handleDeletePlantilla(pl.id, tipo)}
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
                                                            className="px-2 py-0.5 bg-gray-800/40 hover:bg-gray-700/60 text-slate-500 hover:text-slate-300 border border-gray-800/80 rounded text-[11px] transition-colors cursor-pointer"
                                                            title={`Subir ${tipo}`}
                                                        >
                                                            {labelMap[tipo]}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                        <td className="py-4 px-3 text-right">
                                            <button 
                                                onClick={() => handleDelete(decl.id)}
                                                className="p-2 hover:bg-red-500/10 hover:text-red-400 text-slate-400 rounded-lg transition-colors inline-flex items-center"
                                                title="Eliminar declaración"
                                            >
                                                <Trash2 className="w-4.5 h-4.5" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            
            {declaraciones.length > 0 && totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 px-2">
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800/50 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Anterior
                    </button>
                    <span className="text-sm text-slate-400">
                        Página <span className="text-slate-200 font-semibold">{currentPage}</span> de <span className="text-slate-200 font-semibold">{totalPages}</span>
                    </span>
                    <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800/50 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}
