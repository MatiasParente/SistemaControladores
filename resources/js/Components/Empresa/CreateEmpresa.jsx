import { useForm } from '@inertiajs/react';
import { useState } from 'react';

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
    <div className='p-4'>
        <button 
            onClick={() => setIsOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition-colors"
        >
            + Agregar Empresa
        </button>

        {isOpen && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                
                <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
                    
                    <h3 className="text-xl font-bold text-white">Crear Empresa</h3>
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        
                        <div className="flex flex-col gap-1">
                            <label htmlFor="razonSocial" className="text-sm text-slate-400 font-medium">Razon Social</label>
                            <input 
                                type="text" 
                                value={data.razonSocial} 
                                onChange={e => setData('razonSocial', e.target.value)} 
                                id="razonSocial" 
                                className="bg-[#131926] border border-slate-800 rounded-lg p-2.5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                placeholder="Ej: Umbrella Corporation"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="rut" className="text-sm text-slate-400 font-medium">RUT</label>
                            <input 
                                type="text" 
                                value={data.rut} 
                                onChange={e => setData('rut', e.target.value)} 
                                id="rut" 
                                className="bg-[#131926] border border-slate-800 rounded-lg p-2.5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                placeholder="123456789012"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="direccion" className="text-sm text-slate-400 font-medium">Dirección</label>
                            <input 
                                type="text" 
                                value={data.direccion} 
                                onChange={e => setData('direccion', e.target.value)} 
                                id="direccion" 
                                className="bg-[#131926] border border-slate-800 rounded-lg p-2.5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                placeholder="Av. Manganga 13"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="logo" className="text-sm text-slate-400 font-medium">Logo</label>
                            <input 
                                type="file" 
                                onChange={e => setData('logo', e.target.files[0])} 
                                id="logo" 
                                className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer"
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <button 
                                type="button" 
                                onClick={closeModal}
                                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                            >
                                Agregar Empresa
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        )}
    </div>
);
}