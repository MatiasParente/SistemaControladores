import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { PlusCircle, Building2, Briefcase, CreditCard, MapPin, Image as ImageIcon, X } from 'lucide-react';

export default function CreateEmpresa() {

    const { data, setData, post, reset } = useForm({
        razonSocial: '',
        rut: '',
        direccion: '',
        logo: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('empresas.store'), {
            onSuccess: () => closeModal()
        });
    };

    const closeModal = () => {
        setIsOpen(false);
        reset();
    };

    const [isOpen, setIsOpen] = useState(false);

    return (
    <div className='mb-6'>
        <button 
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25 border border-blue-500/50"
        >
            <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Agregar Empresa
        </button>

        {isOpen && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                
                <div className="bg-gray-100 dark:bg-[#0b0f19] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                    
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Building2 className="w-6 h-6 text-blue-500" />
                            </div>
                            Crear Empresa
                        </h3>
                        <button onClick={closeModal} className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-100 dark:bg-slate-800">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="razonSocial" className="text-sm text-slate-400 font-medium ml-1">Razón Social</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Briefcase className="h-5 w-5 text-slate-500" />
                                </div>
                                <input 
                                    type="text" 
                                    value={data.razonSocial} 
                                    onChange={e => setData('razonSocial', e.target.value)} 
                                    id="razonSocial" 
                                    className="block w-full pl-11 pr-4 py-2.5 bg-white dark:bg-[#070b14] border border-gray-200 dark:border-gray-800 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                                    placeholder="Ej: Umbrella Corporation"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="rut" className="text-sm text-slate-400 font-medium ml-1">RUT</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <CreditCard className="h-5 w-5 text-slate-500" />
                                </div>
                                <input 
                                    type="text" 
                                    value={data.rut} 
                                    onChange={e => setData('rut', e.target.value)} 
                                    id="rut" 
                                    className="block w-full pl-11 pr-4 py-2.5 bg-white dark:bg-[#070b14] border border-gray-200 dark:border-gray-800 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                                    placeholder="123456789012"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="direccion" className="text-sm text-slate-400 font-medium ml-1">Dirección</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-slate-500" />
                                </div>
                                <input 
                                    type="text" 
                                    value={data.direccion} 
                                    onChange={e => setData('direccion', e.target.value)} 
                                    id="direccion" 
                                    className="block w-full pl-11 pr-4 py-2.5 bg-white dark:bg-[#070b14] border border-gray-200 dark:border-gray-800 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                                    placeholder="Av. Principal 123"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="logo" className="text-sm text-slate-400 font-medium ml-1">Logo de la Empresa</label>
                            <div className="relative group">
                                <input 
                                    type="file" 
                                    onChange={e => setData('logo', e.target.files[0])} 
                                    id="logo" 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="flex items-center gap-3 w-full pl-3 pr-4 py-2.5 bg-white dark:bg-[#070b14] border border-gray-200 dark:border-gray-800 rounded-xl transition-all shadow-inner group-hover:border-blue-500/50">
                                    <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                        <ImageIcon className="h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                                    </div>
                                    <span className="text-slate-400 text-sm truncate">
                                        {data.logo ? data.logo.name : "Seleccionar archivo de imagen..."}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800/60">
                            <button 
                                type="button" 
                                onClick={closeModal}
                                className="px-5 py-2.5 text-sm font-semibold text-slate-400 hover:text-white bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 border border-blue-500/50"
                            >
                                Guardar Empresa
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        )}
    </div>
);
}