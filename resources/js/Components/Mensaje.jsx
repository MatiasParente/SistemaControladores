import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function Mensaje({ mensaje }) {
    const [mostrarMensaje, setMostrarMensaje] = useState(false);

    useEffect(() => {
        if (mensaje) {
            setMostrarMensaje(true);
            const timer = setTimeout(() => {
                setMostrarMensaje(false);
            }, 30000);
            return () => clearTimeout(timer); 
        }
    }, [mensaje]);

    if (!mostrarMensaje || !mensaje) return null;

    return (
        <div className="fixed z-50 bottom-4 left-4 right-4 md:bottom-auto md:top-4 md:left-auto md:right-4 md:w-96 bg-emerald-300 dark:bg-emerald-500/10 border border-emerald-500 dark:border-emerald-500/20 shadow-xl rounded-xl p-4 flex items-center transition-all duration-300">
            <p className="text-emerald-700 dark:text-emerald-300 text-sm font-medium">{mensaje}</p>
            <button
                onClick={() => setMostrarMensaje(false)}
                className="ml-auto text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-500"
            >
                <X />
            </button>
        </div>
    );
}