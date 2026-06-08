import { Link } from '@inertiajs/react';

export default function AttentionRequirement({ atenciones }) {
    if (!atenciones || !atenciones.data || atenciones.data.length === 0) return null;

    return (
        <div className="bg-[#0b0f19] border border-slate-800/60 rounded-2xl p-6 max-w-xl">
            <h2 className="text-xl font-bold text-white mb-6">
                Planillas Faltantes (Atención Requerida)
            </h2>
            
            <div className="space-y-4">
                {atenciones.data.map(({ empresa, declaracion, faltantes }) => {
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

            <div className="flex items-center justify-between mt-6 px-1">
                <div>
                    {(() => {
                        const firstLink = atenciones?.links?.[0];
                        if (!firstLink) return null;
                        const label = 'Anterior';
                        
                        if (!firstLink.url) {
                            return (
                                <span 
                                    className="px-3 py-1.5 text-sm font-medium text-slate-500 bg-slate-800/30 rounded-lg cursor-not-allowed border border-gray-800/40 select-none"
                                    dangerouslySetInnerHTML={{ __html: label }} 
                                />
                            );
                        }

                        return (
                            <Link
                                href={firstLink.url}
                                className="px-3 py-1.5 text-sm font-medium text-slate-300 bg-slate-800/50 rounded-lg hover:bg-slate-700 hover:text-white border border-gray-700/30 transition-colors shadow-sm"
                                dangerouslySetInnerHTML={{ __html: label }}
                            />
                        );
                    })()}
                </div>
                
                <span className="text-sm text-slate-400">
                    Página <span className="text-slate-200 font-semibold">{atenciones?.current_page}</span> de <span className="text-slate-200 font-semibold">{atenciones?.last_page}</span>
                </span>
                
                <div>
                    {(() => {
                        const lastLink = atenciones?.links?.[atenciones.links.length - 1];
                        if (!lastLink) return null;
                        const label = 'Siguiente';

                        if (!lastLink.url) {
                            return (
                                <span 
                                    className="px-3 py-1.5 text-sm font-medium text-slate-500 bg-slate-800/30 rounded-lg cursor-not-allowed border border-gray-800/40 select-none"
                                    dangerouslySetInnerHTML={{ __html: label }} 
                                />
                            );
                        }

                        return (
                            <Link
                                href={lastLink.url}
                                className="px-3 py-1.5 text-sm font-medium text-slate-300 bg-slate-800/50 rounded-lg hover:bg-slate-700 hover:text-white border border-gray-700/30 transition-colors shadow-sm"
                                dangerouslySetInnerHTML={{ __html: label }}
                            />
                        );
                    })()}
                </div>
            </div>
        </div>
    );
}