import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function FilterDeclaracion({ filtroActual, filtroActualEstado, filtroActualAño }) {
    const [busqueda, setBusqueda] = useState(filtroActual || '');
    const [buscarEstado, setBuscarEstado] = useState(filtroActualEstado || '');
    const [buscarAño, setBuscarAño] = useState(filtroActualAño || '');

    // Generar el año actual y los 4 anteriores automáticamente
    const añoActual = new Date().getFullYear();
    const ultimosAnios = Array.from({ length: 5 }, (_, i) => añoActual - i);

    useEffect(() => {
        router.get(route('declaraciones.index'), 
            { buscar: busqueda, buscarEstado: buscarEstado, buscarAño: buscarAño }, 
            { preserveState: true, replace: true }
        );
    }, [busqueda, buscarEstado, buscarAño]);

    return (
        <div className="bg-[#0B1121] p-6 rounded-3xl border border-gray-800 shadow-xl flex flex-col md:flex-row gap-4 items-end w-full">
            
            <div className="w-full flex flex-col gap-2 flex-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Buscar por empresa</label>
                <input
                    type="text"
                    placeholder="Escribe la Razón Social o RUT"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full rounded-xl border border-gray-800 bg-[#0B1121] px-4 py-2.5 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-600 transition-colors"
                />
            </div>

            <div className="w-full md:w-52 flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Estado</label>
                <select
                    value={buscarEstado}
                    onChange={(e) => setBuscarEstado(e.target.value)}
                    className="w-full rounded-xl border border-gray-800 bg-[#0B1121] px-4 py-2.5 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer transition-colors"
                >
                    <option value="" className="bg-[#0B1121]">Todos</option>
                    <option value="1" className="bg-[#0B1121]">Pendiente</option>
                    <option value="2" className="bg-[#0B1121]">En Proceso</option>
                    <option value="3" className="bg-[#0B1121]">Finalizado</option>
                </select>
            </div>

            <div className="w-full md:w-44 flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Año Fiscal</label>
                <select
                    value={buscarAño}
                    onChange={(e) => setBuscarAño(e.target.value)}
                    className="w-full rounded-xl border border-gray-800 bg-[#0B1121] px-4 py-2.5 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer transition-colors"
                >
                    <option value="" className="bg-[#0B1121]">Todos</option>
                    {ultimosAnios.map((anio) => (
                        <option key={anio} value={anio} className="bg-[#0B1121]">
                            {anio}
                        </option>
                    ))}
                </select>
            </div>

        </div>
    );
}