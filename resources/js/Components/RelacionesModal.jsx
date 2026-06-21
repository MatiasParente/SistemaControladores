import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export default function RelacionesModal({ isOpen, onClose, url, title }) {
    const [data, setData] = useState({ data: [], current_page: 1, last_page: 1 });
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    //usamos el axios para obtener los datos, pasamos la url que viene de la props y la search que es el valor del input
    const fetchData = async (pageUrl = url) => {
        if (!isOpen || !pageUrl) return;
        
        setLoading(true);
        try {
            const response = await axios.get(pageUrl, {
                params: { search: search }
            });
            setData(response.data);
        } catch (error) {
            console.error("Error cargando relaciones", error);
        } finally {
            setLoading(false);
        }
    };

    //usamos el useEffect para que cuando cambie la busqueda o se abra el modal, se actualice la data
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (isOpen) {
                fetchData(url);
            }
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [search, isOpen, url]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#0B1121] border border-gray-200 dark:border-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">

                <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{title}</h3>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-5 pb-0">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-[#070b14] border border-gray-200 dark:border-gray-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
                    {loading && data.data.length === 0 ? (
                        <div className="flex justify-center items-center py-10 text-blue-500">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                    ) : data.data.length === 0 ? (
                        <div className="text-center py-10 text-slate-500 text-sm">
                            No se encontraron resultados.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {data.data.map((item) => (
                                <div key={item.id} className="p-3 bg-slate-50 dark:bg-slate-800/30 border border-gray-100 dark:border-gray-800 rounded-xl flex flex-col">
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                                        {item.name || item.razonSocial}
                                    </span>
                                    {(item.email || item.rut) && (
                                        <span className="text-xs text-slate-500 mt-0.5">
                                            {item.email || item.rut}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/*paginación */}
                {data.last_page > 1 && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-slate-50 dark:bg-[#070b14] rounded-b-2xl">
                        <button
                            onClick={() => fetchData(data.prev_page_url)}
                            disabled={!data.prev_page_url || loading}
                            className="inline-flex items-center justify-center p-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-slate-600 dark:text-slate-300 disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            Página {data.current_page} de {data.last_page}
                        </span>

                        <button
                            onClick={() => fetchData(data.next_page_url)}
                            disabled={!data.next_page_url || loading}
                            className="inline-flex items-center justify-center p-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-slate-600 dark:text-slate-300 disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
