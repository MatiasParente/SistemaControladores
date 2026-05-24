import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function FiltEmpresa({ filtroActual }) {
    const [busqueda, setBusqueda] = useState(filtroActual || '');

    useEffect(() => {
        router.get(route('empresas.index'), 
            { buscar: busqueda }, 
            { preserveState: true, replace: true }
        );
    }, [busqueda]);

    return (
        <div className="w-full md:w-1/3 bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-400">Buscar Empresa:</label>
            <input
                type="text"
                placeholder="Escribe la Razón Social o RUT"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-500"
            />
        </div>
    );
}