export default function ProgressBar({ stats, total }) {

    const pendientes = stats?.pendientes || 0;
    const enProceso = stats?.enProceso || 0;
    const finalizadas = stats?.finalizadas || 0;
    
    const safeTotal = total > 0 ? total : 1; 

    const pendientesPorcentaje = (pendientes / safeTotal) * 100;
    const enProcesoPorcentaje = (enProceso / safeTotal) * 100;
    const finalizadasPorcentaje = (finalizadas / safeTotal) * 100;

    return (
    <div className="w-full bg-[#0b0f19] border border-slate-800/60 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 tracking-wide">
            Estado Global Año Fiscal
        </h3>
        
        <div className="space-y-6">

            <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-400">Pendientes</span>
                    <span className="text-yellow-500">
                        {pendientes} ({Math.round(pendientesPorcentaje)}%)
                    </span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden bg-slate-800/50">
                    <div 
                        className="bg-yellow-500 h-full rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${pendientesPorcentaje}%` }}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-400">En Proceso</span>
                    <span className="text-blue-500">
                        {enProceso} ({Math.round(enProcesoPorcentaje)}%)
                    </span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden bg-slate-800/50">
                    <div 
                        className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${enProcesoPorcentaje}%` }}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-400">Finalizadas</span>
                    <span className="text-emerald-500">
                        {finalizadas} ({Math.round(finalizadasPorcentaje)}%)
                    </span>
                </div>

                <div className="w-full h-2 rounded-full overflow-hidden bg-slate-800/50">
                    <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${finalizadasPorcentaje}%` }}
                    />
                </div>
            </div>

        </div>
    </div>
);
}
    