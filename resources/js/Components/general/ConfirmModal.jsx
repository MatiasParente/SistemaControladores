import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#0B1121] border border-gray-200 dark:border-gray-800 w-full max-w-sm rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800 bg-red-50 dark:bg-red-500/10">
                    <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                        <AlertTriangle className="w-6 h-6" />
                        <h3 className="text-lg font-bold">{title || 'Confirmar acción'}</h3>
                    </div>
                    <button 
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-red-100 dark:hover:bg-red-500/20 p-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-5">
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                        {message}
                    </p>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-3 bg-slate-50 dark:bg-[#070b14]">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onCancel();
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
                    >
                        Sí, continuar
                    </button>
                </div>
            </div>
        </div>
    );
}
