import { useState, useMemo } from 'react';

export default function AttentionRequirement({ declaraciones = [], empresas = [] }) {
    const planillasRequeridas = ['Original', 'IRAE', 'Patrimonio', 'Balance'];

    const atenciones = useMemo(() => {
        const list = [];
        empresas.forEach(empresa => {
            const decls = declaraciones.filter(d => d.idEmpresa === empresa.id);
            decls.forEach(declaracion => {
                const plantillasExistentes = declaracion.plantillas?.map(p => p.tipoPlantilla) || [];
                const faltantes = planillasRequeridas.filter(tipo => !plantillasExistentes.includes(tipo));
                if (faltantes.length > 0) {
                    list.push({ empresa, declaracion, faltantes });
                }
            });
        });
        return list;
    }, [empresas, declaraciones]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const totalPages = Math.max(1, Math.ceil(atenciones.length / itemsPerPage));
    const currentAtenciones = atenciones.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (atenciones.length === 0) return null;

    return (
        <div className="bg-[#0b0f19] border border-slate-800/60 rounded-2xl p-6 max-w-xl">
            <h2 className="text-xl font-bold text-white mb-6">
                Planillas Faltantes (Atención Requerida)
            </h2>
            
            <div className="space-y-4">
                {currentAtenciones.map(({ empresa, declaracion, faltantes }) => {
                    const anioFiscal = declaracion.fechaFiscalFin 
                        ? new Date(declaracion.fechaFiscalFin).getFullYear() 
                        : 'N/A';

                    return (
                        <div 
                            key={declaracion.id} 
                            className="bg-[#131926] border border-slate-800 rounded-xl p-5 flex items-center justify-between gap-4 transition-all hover:border-slate-700"
                        >
                            <div className="flex flex-col gap-1">
                                <h3 className="text-base font-bold text-slate-200 tracking-wide">
                                    {empresa.razonSocial}
                                </h3>
                                <span className="text-sm text-slate-400">
                                    Año Fiscal: <span className="text-slate-300 font-medium">{anioFiscal}</span>
                                </span>
                            </div>

                            <div className="bg-[#241a15] border border-[#ff8132]/20 rounded-lg p-3 max-w-[220px] md:max-w-[260px]">
                                <p className="text-sm text-[#ff9655] font-medium leading-relaxed">
                                    Falta: {faltantes.join(', ')}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 px-1">
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 text-sm font-medium text-slate-300 bg-slate-800/50 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Anterior
                    </button>
                    <span className="text-sm text-slate-400">
                        Página <span className="text-slate-200 font-semibold">{currentPage}</span> de <span className="text-slate-200 font-semibold">{totalPages}</span>
                    </span>
                    <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 text-sm font-medium text-slate-300 bg-slate-800/50 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}