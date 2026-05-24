import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { AlertTriangle, X } from 'lucide-react';

export default function ErrorModal() {
    const { flash } = usePage().props;
    const [isVisible, setIsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (flash?.error) {
            setErrorMessage(flash.error);
            setIsVisible(true);

            //ocultar automáticamente después de 6 segundos
            const timer = setTimeout(() => setIsVisible(false), 6000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1E293B] border border-red-500/30 rounded-2xl shadow-2xl max-w-md w-full p-6 relative overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <button 
                    onClick={() => setIsVisible(false)}
                    className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center mt-2">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">¡Ha ocurrido un error!</h3>
                    <p className="text-slate-300 text-sm mb-6">
                        {errorMessage}
                    </p>
                    
                    <button 
                        onClick={() => setIsVisible(false)}
                        className="w-full py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-red-500/20"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
}
