import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Iniciar Sesión" />

            <div className="mb-6 text-center">
                <p className="text-sm text-slate-400 mt-2">
                    Ingresa tus credenciales para acceder al panel.
                </p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 p-3 rounded-xl text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Correo Electrónico" className="text-slate-700 dark:text-slate-300 font-medium mb-1.5 block" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-white dark:bg-[#070b14] border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-xl px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="tu@correo.com"
                    />

                    <InputError message={errors.email} className="mt-2 text-rose-400 text-xs" />
                </div>


                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <InputLabel htmlFor="password" value="Contraseña" className="text-slate-700 dark:text-slate-300 font-medium block" />
                    </div>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full bg-white dark:bg-[#070b14] border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-xl px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="••••••••"
                    />

                    <InputError message={errors.password} className="mt-2 text-rose-400 text-xs" />
                </div>

                <div className="block pt-1">
                    <label className="flex items-center cursor-pointer group">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="bg-white dark:bg-[#070b14] border-gray-200 dark:border-gray-800 rounded text-blue-600 focus:ring-blue-500/50"
                        />
                        <span className="ms-2.5 text-sm text-slate-400 group-hover:text-slate-800 dark:text-slate-200 transition-colors select-none">
                            Recuérdame
                        </span>
                    </label>
                </div>
                <div className="pt-2">
                    <PrimaryButton 
                        className="w-full justify-center py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-900/20 text-sm disabled:opacity-50" 
                        disabled={processing}
                    >
                        {processing ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}