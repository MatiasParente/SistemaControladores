import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function SelectEmpresa({ empresasDisponibles = [], selectedIds = [], onChange }) {
const [isOpen, setIsOpen] = useState(false);
const dropdownRef = useRef(null);

useEffect(() => {
    
    //cerrar en caso de dar click en otro lado
    const clickAfuera = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };
    document.addEventListener("mousedown", clickAfuera);
    return () => {
        document.removeEventListener("mousedown", clickAfuera);
    };
    }, []);

    const seleccionarYdeseleccionar=(id)=>{
        let updateIds; //let porque el valor puede cambiar, const no se puede modificar
        if(selectedIds.includes(id)){
            //si ya esta agregado, lo eliminamos
            updateIds = selectedIds.filter(i => i !== id);
        }else{
            //si no esta agregado, lo agregamos
            updateIds = [...selectedIds, id];
        }
        onChange(updateIds);
    }

    return (
        <div className="relative w-64 text-left" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-white dark:bg-[#070b14] border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            >
                <span className="truncate text-slate-700 dark:text-slate-300">
                    {selectedIds.length === 0 
                        ? 'Seleccionar empresas...' 
                        : `${selectedIds.length} ${selectedIds.length === 1 ? 'seleccionada' : 'seleccionadas'}`
                    }
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-full max-h-52 overflow-y-auto bg-gray-100 dark:bg-[#0f172a] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl z-50 p-1 custom-scrollbar">
                    {empresasDisponibles.length === 0 ? (
                        <div className="text-xs text-slate-500 p-2 text-center">No hay empresas disponibles</div>
                    ) : (
                        empresasDisponibles.map((empresa) => {
                            const isSelected = selectedIds.includes(empresa.id);
                            return (
                                <button
                                    key={empresa.id}
                                    type="button"
                                    onClick={() => seleccionarYdeseleccionar(empresa.id)}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors mb-0.5 last:mb-0 text-left ${
                                        isSelected 
                                        ? 'bg-blue-600/20 text-blue-400 font-medium' 
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-800/60'}`}>
                                    <span className="truncate">{empresa.razonSocial}</span>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                                </button>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}