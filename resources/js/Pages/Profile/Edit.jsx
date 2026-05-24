import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold text-white">
                    Perfil
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="space-y-8">
                {/* Cambiado a grid de 1 columna en móvil y 3 en pantallas grandes, igual al original pero con espaciado consistente */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    {/* Tarjeta 1: Información de Perfil */}
                    <div className="bg-[#0b1329] border border-[#1e293b] p-6 shadow-xl rounded-xl">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl text-slate-200"
                        />
                    </div>

                    {/* Tarjeta 2: Actualizar Contraseña */}
                    <div className="bg-[#0b1329] border border-[#1e293b] p-6 shadow-xl rounded-xl">
                        <UpdatePasswordForm className="max-w-xl text-slate-200" />
                    </div>

                    {/* Tarjeta 3: Eliminar Cuenta */}
                    <div className="bg-[#0b1329] border border-[#1e293b] p-6 shadow-xl rounded-xl">
                        <DeleteUserForm className="max-w-xl text-slate-200" />
                    </div>
                    
                </div>
            </div>
        </AuthenticatedLayout>
    );
}