import { router, Link } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { Search, Building2 } from 'lucide-react';

export default function FilterUser({ empresas, filtroActual, filtroActualEmpresa }){
    const [searchTerm, setSearchTerm] = useState(filtroActual || '');
    const [selectedEmpresa, setSelectedEmpresa] = useState(filtroActualEmpresa || '');
    const isSearching = useRef(false);

    const firstRender = useRef(true);
    
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return; 
        }
        const timer = setTimeout(() => {
            router.get(
                route('usuarios.index'), 
                { buscar: searchTerm, buscarEmpresa: selectedEmpresa },
                { 
                    preserveState: true, 
                    replace: true        
                }
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, selectedEmpresa]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (isSearching.current) return;
        isSearching.current = true;
        
        router.get(route('usuarios.index'), { 
            buscar: searchTerm || null, 
            buscarEmpresa: selectedEmpresa || null
        }, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => isSearching.current = false
        });
    };

    const handleEmpresaFilter = (empresaId) => {
        setSelectedEmpresa(empresaId);
        
        if (isSearching.current) return;
        isSearching.current = true;

        router.get(route('usuarios.index'), {
            buscar: searchTerm || null,
            buscarEmpresa: empresaId || null
        }, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => isSearching.current = false
        });
    };

    return (
        <div className="bg-gray-50 dark:bg-[#0B1121] p-4 md:p-5 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl mb-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
                <form onSubmit={handleSearch} className="relative w-full md:flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar usuario por nombre o correo..."
                        className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-[#070b14] border border-gray-200 dark:border-gray-800 rounded-2xl text-slate-800 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-inner"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="hidden"></button>
                </form>

                <div className="relative w-full md:w-80">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building2 className="h-5 w-5 text-slate-500" />
                    </div>
                    <select
                        value={selectedEmpresa}
                        onChange={(e) => handleEmpresaFilter(e.target.value)}
                        className="block w-full pl-11 pr-10 py-3 bg-white dark:bg-[#070b14] border border-gray-200 dark:border-gray-800 rounded-2xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer shadow-inner"
                    >
                        <option value="">Todas las empresas</option>
                        {empresas.map((empresa) => (
                            <option key={empresa.id} value={empresa.id}>
                                {empresa.razonSocial}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}