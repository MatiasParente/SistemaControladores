import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

//header es lo de arriba de las paginas, childeren es el contendio de la pagina que si se borra queda todo en blanco
export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    //Esto sirve para los celulares, para abrir y cerrar el menu lateral
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
    <div className="min-h-screen flex bg-[#070A13] text-gray-100">
        
        {/* 1. SIDEBAR ESCRITORIO (Se muestra de md en adelante) */}
        <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
            <SidebarContent />
        </aside>

        {/* 2. SIDEBAR MÓVIL (Con animación de apertura/cierre) */}
        <div className={`fixed inset-0 z-50 flex md:hidden transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
            {/* Fondo oscuro traslúcido detrás del menú */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            
            {/* Menú deslizante */}
            <aside className={`relative w-64 max-w-xs flex-col flex transition-transform duration-300 ${
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <SidebarContent />
            </aside>
        </div>

        {/* 3. CONTENIDO PRINCIPAL (Se desplaza a la derecha en escritorio con md:pl-64) */}
        <div className="flex-1 flex flex-col md:pl-64">
            
            {/* Barra superior móvil con botón hamburguesa */}
            <header className="h-16 flex items-center justify-between px-6 bg-[#0B1121] border-b border-gray-800 md:hidden">
                <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-400 hover:text-white">
                    {/* Icono de menú hamburguesa (3 líneas) */}
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <span className="font-bold text-emerald-400">CtrlConta</span>
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white">
                    {user.name.charAt(0)}
                </div>
            </header>

            {/* Encabezado de la página */}
            {header && (
                <header className="py-6 px-8 bg-[#070A13]">
                    {header}
                </header>
            )}

            {/* Contenido dinámico */}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    </div>
);
    
    }

    function SidebarContent({ activeRoute }) {
    return (
        <div className="flex flex-col h-full bg-[#0B1121] text-gray-300 p-6">
            {/* Logo de CtrlConta */}
            <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-gradient-to-tr from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                    {/* Icono del logo */}
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <span className="text-xl font-bold text-white tracking-wider">CtrlConta</span>
            </div>

            <nav className="flex-1 space-y-2">
                <Link 
                    href={route('dashboard')} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        route().current('dashboard') 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'hover:bg-gray-800/50 hover:text-white'
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>

                    Dashboard
                </Link>

                <Link 
                    href={route('empresas.index')} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        route().current('empresas.*') 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'hover:bg-gray-800/50 hover:text-white'
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>

                    Empresas
                </Link>

                <Link 
                    href={route('usuarios.index')} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        route().current('usuarios.*') 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'hover:bg-gray-800/50 hover:text-white'
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    
                    Usuarios
                </Link>
                <Link 
                    href={route('declaraciones.index')} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        route().current('declaraciones.*') 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'hover:bg-gray-800/50 hover:text-white'
                    }`}
                >

                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>

                    Declaraciones
                </Link>
            </nav>

            <div className="pt-6 border-t border-gray-800">
                <Link 
                    href={route('logout')} 
                    method="post" 
                    as="button" 
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>

                    Cerrar Sesión
                </Link>
            </div>
        </div>
    );
}

