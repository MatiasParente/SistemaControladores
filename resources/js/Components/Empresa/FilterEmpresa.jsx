import { router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

export default function FiltEmpresa({ filtroActual }) {
    const [busqueda, setBusqueda] = useState(filtroActual || '');
    const firstRender = useRef(true);
    
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return; 
        }
        const timer = setTimeout(() => {
            router.get(
                route('empresas.index'), 
                { buscar: busqueda },
                { 
                    preserveState: true, 
                    replace: true        
                }
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [busqueda]);

    return (
        <div className="bg-gray-50 dark:bg-[#0B1121] p-4 md:p-5 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl mb-2">
            <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-500" />
                </div>
                <input
                    type="text"
                    placeholder="Buscar empresa por Razón Social, RUT o Dirección..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-[#070b14] border border-gray-200 dark:border-gray-800 rounded-2xl text-slate-800 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-inner"
                />
            </div>
        </div>
    );
}