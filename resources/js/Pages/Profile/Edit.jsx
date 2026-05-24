import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Perfil</h2>
                        <p className="text-sm text-slate-400 mt-1">Información de usuario.</p>
                    </div>
                </div>
            }
        >
            <Head title="Profile" />

            <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    <div className="bg-[#0b1329] border border-[#1e293b] p-6 shadow-xl rounded-xl">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl text-slate-200"
                        />
                    </div>

                    <div className="bg-[#0b1329] border border-[#1e293b] p-6 shadow-xl rounded-xl">
                        <UpdatePasswordForm className="max-w-xl text-slate-200" />
                    </div>
                    <div className="bg-[#0b1329] border border-[#1e293b] p-6 shadow-xl rounded-xl">
                        <DeleteUserForm className="max-w-xl text-slate-200" />
                    </div>
                    
                </div>
            </div>
        </AuthenticatedLayout>
    );
}