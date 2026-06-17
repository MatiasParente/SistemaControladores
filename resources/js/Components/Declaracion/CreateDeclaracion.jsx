import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Building2, Calendar, FileSpreadsheet, Check, AlertCircle, Loader2 } from "lucide-react";

export default function CreateDeclaracion({ empresas = [], estados = [] }) {

    const estadoPendiente = estados.find(e => e.tipoEstado === 'Pendiente') || estados[0];
    
    //le pedimos al sistema que nos de la fecha actual y la pasamos a string
    const currentYear = new Date().getFullYear().toString();


    const { data, setData, post, processing, errors, reset } = useForm({
        idEmpresa: '',
        fechaFiscalInicio: `${currentYear}-01-01`,
        fechaFiscalFin: `${currentYear}-12-31`,
        idEstado: estadoPendiente ? estadoPendiente.id : '',
        Original: null,
        IRAE: null,
        Patrimonio: null,
        Balance: null,
    });

    useEffect(() => {
        if (estados.length > 0) {
            let filesCount = 0;
            if (data.Original) filesCount++;
            if (data.IRAE) filesCount++;
            if (data.Patrimonio) filesCount++;
            if (data.Balance) filesCount++;

            let targetEstado = 'Pendiente';
            if (filesCount === 4) {
                targetEstado = 'Finalizada';
            } else if (filesCount > 0) {
                targetEstado = 'En Proceso';
            }

            const estado = estados.find(e => e.tipoEstado === targetEstado) || estados[0];
            if (estado && data.idEstado !== estado.id) {
                setData('idEstado', estado.id);
            }
        }
    }, [data.Original, data.IRAE, data.Patrimonio, data.Balance, estados]);

    const handleFileChange = (tipo, file) => {
        setData(tipo, file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('declaraciones.store'), {
            onSuccess: () => {
                reset('Original', 'IRAE', 'Patrimonio', 'Balance', 'idEmpresa');
                alert('¡Declaración creada con éxito!');
            },
            onError: (err) => {
                console.error("Errores al crear declaración:", err);
            }
        });
    };

    const plantillasDisponibles = [
        { key: 'Original', label: 'Original' },
        { key: 'IRAE', label: 'IRAE' },
        { key: 'Patrimonio', label: 'Impuesto Patrimonio' },
        { key: 'Balance', label: 'Balance Banco' },
    ];

    const currentEstado = estados.find(e => e.id === data.idEstado);
    const estadoName = currentEstado ? currentEstado.tipoEstado : 'Pendiente';

    const getStatusColor = (statusName) => {
        if (statusName === 'Pendiente') return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        if (statusName === 'En Proceso') return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        if (statusName === 'Rechazada') return 'bg-red-500/10 text-red-500 border-red-500/20';
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    };

    return (
        <div className="bg-white dark:bg-[#0B1121] text-slate-800 dark:text-slate-200 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 w-full max-w-md shadow-2xl">
            {/* Título */}
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-emerald-400 text-3xl font-light">+</span> Nueva Declaración
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Empresa */}
                <div className="flex flex-col gap-2">
                    <label className="text-slate-400 text-sm font-medium">Empresa</label>
                    <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <select 
                            value={data.idEmpresa}
                            onChange={(e) => setData('idEmpresa', e.target.value)}
                            className={`w-full bg-white dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 pl-12 pr-10 py-3.5 rounded-xl border ${errors.idEmpresa ? 'border-red-500' : 'border-gray-200 dark:border-gray-800'} focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer text-sm`}
                        >
                            <option value="" disabled>Selecciona una empresa</option>
                            {empresas.map((emp) => (
                                <option key={emp.id} value={emp.id} className="bg-white dark:bg-[#0f172a]">
                                    {emp.razonSocial} ({emp.rut})
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors.idEmpresa && (
                        <span className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.idEmpresa}
                        </span>
                    )}
                </div>

                {/* Año Fiscal */}
                <div className="flex flex-col gap-2">
                    <label className="text-slate-400 text-sm font-medium">Año Fiscal</label>
                    <div className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0F172A] text-slate-800 dark:text-slate-200 text-sm font-semibold shadow-sm select-none">
                        <Calendar className="w-5 h-5 text-slate-400 opacity-70" />
                        <span>{currentYear}</span>
                    </div>
                </div>
                            {/*Creamos un array con los ultimos 5 años y los mostramos en un select
                            el array.from({length: 5} sirve para crear un array de 5 elementos, el (_, index)
                            es para ignorar el primer elemento y trabajar con el indice, que va de 0 a 4
                            la const year se encarga de restar el indice al año actual, para que se muestren los ultimos 5 años
                            
                            {Array.from({ length: 5 }, (_, index) => {
                                const year = (new Date().getFullYear() - index).toString();
                                return (
                                    <option key={year} value={year} className="bg-[#0f172a]">
                                        {year}
                                    </option>
                                );
                            })}*/}

                <div className="flex flex-col gap-2">
                    <label className="text-slate-400 text-sm font-medium">Estado</label>
                    <div className={`w-full flex items-center gap-3 pl-4 pr-10 py-3.5 rounded-xl border text-sm font-semibold ${getStatusColor(estadoName)}`}>
                        <Building2 className="w-5 h-5 opacity-70" />
                        {estadoName}
                    </div>
                </div>

                {/* Planillas */}
                <div className="space-y-3 pt-2">
                    <label className="text-slate-400 text-sm font-medium block">Planillas (Archivos Excel)</label>
                    
                    <div className="grid grid-cols-1 gap-2.5">
                        {plantillasDisponibles.map((plantilla) => (
                            <label 
                                key={plantilla.key} 
                                className={`flex items-center justify-between p-3.5 bg-white dark:bg-[#0F172A] rounded-xl border ${data[plantilla.key] ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:border-gray-700'} cursor-pointer`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${data[plantilla.key] ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-100 dark:bg-gray-800 text-slate-400'}`}>
                                        <FileSpreadsheet className="w-4 h-4" />
                                    </div>
                                    <span className="text-slate-800 dark:text-slate-200 text-sm font-medium">{plantilla.label}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    {data[plantilla.key] ? (
                                        <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                                            <Check className="w-3.5 h-3.5" /> Cargado
                                        </span>
                                    ) : (
                                        <span className="text-slate-500 text-xs hover:text-slate-700 dark:text-slate-300">Subir archivo</span>
                                    )}
                                </div>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept=".xlsx, .xls"
                                    onChange={(e) => handleFileChange(plantilla.key, e.target.files[0])}
                                />
                            </label>
                        ))}
                    </div>
                </div>

                {/* Botón de Guardar */}
                <button 
                    type="submit" 
                    disabled={processing}
                    className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 disabled:bg-emerald-500/50 text-gray-100 dark:text-slate-900 font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                    {processing ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" /> Guardando...
                        </>
                    ) : (
                        "Guardar Declaración"
                    )}
                </button>
            </form>
        </div>
    );
}