import { useState, useEffect } from 'react';
import { UserCircle, LogOut, AlertTriangle, Menu, X, ClipboardCheck } from 'lucide-react';



export default function GestorSidebar({ screen, onGoTo, onLogout, incidenciasPendientes = 0 }) {
    const [isOpen, setIsOpen] = useState(false);

    const closeSidebar = () => setIsOpen(false);

    // Evitar que el fondo (body) haga scroll cuando el menú móvil está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const isClientesActive = ['clientes', 'pedidos', 'detalle-pedido', 'reutilizar', 'nueva-orden'].includes(screen);
    const isIncidenciasActive = screen === 'incidencias';
    const isConfirmacionesActive = screen === 'confirmaciones';

    return (
        <>
            {/* 📱 Mobile Header (Visible solo en tablet o pantallas menores) */}
            <div className="md:hidden flex items-center justify-between p-4 bg-sidebar border-b border-sidebar-border sticky top-0 z-30 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#185FA5] flex items-center justify-center text-[#B5D4F4] text-xs font-semibold flex-shrink-0">
                        CP
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-sidebar-foreground font-bold text-sm leading-tight truncate">UniformesPro</h1>
                        <p className="text-xs text-muted-foreground truncate">Gestión de Órdenes</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 ml-2 text-sidebar-foreground rounded-md hover:bg-sidebar-accent transition-colors focus:outline-none"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* 📱 Backdrop Oscuro para móvil */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity"
                    onClick={closeSidebar}
                />
            )}

            {/* 💻 Sidebar Principal (Fixed en móvil, Sticky en Desktop) */}
            <aside
                className={`
                  w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col flex-shrink-0 overflow-y-auto
                  fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
                  md:sticky md:top-0 md:self-start md:translate-x-0
                  ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
                `}
            >
                {/* Brand */}
                <div className="p-4 border-b border-sidebar-border flex items-center gap-3 relative">
                    <div className="w-9 h-9 rounded-full bg-[#185FA5] flex items-center justify-center text-[#B5D4F4] text-xs font-semibold flex-shrink-0">
                        CP
                    </div>
                    <div className="min-w-0 pr-6">
                        <h1 className="text-sidebar-foreground font-bold text-sm leading-tight truncate">UniformesPro</h1>
                        <p className="text-xs text-muted-foreground">Gestión de Órdenes</p>
                    </div>

                    {/* Botón de cerrar (solo en móvil) */}
                    <button
                        onClick={closeSidebar}
                        className="md:hidden absolute top-4 right-4 p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground rounded-md transition-colors focus:outline-none"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-1">
                        {/* Clientes */}
                        <li>
                            <button
                                onClick={() => {
                                    onGoTo('clientes');
                                    closeSidebar(); // <-- Cierra el menú en móvil al navegar
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isClientesActive
                                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                    }`}
                            >
                                <UserCircle className="w-5 h-5" />
                                <span>Clientes</span>
                            </button>
                        </li>

                        {/* Incidencias */}
                        <li>
                            <button
                                onClick={() => {
                                    onGoTo('incidencias');
                                    closeSidebar(); // <-- Cierra el menú en móvil al navegar
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative ${isIncidenciasActive
                                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                    }`}
                            >
                                <AlertTriangle className="w-5 h-5" />
                                <span className="flex-1 text-left">Incidencias</span>
                                {incidenciasPendientes > 0 && (
                                    <span
                                        className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold ${isIncidenciasActive
                                            ? 'bg-white/20 text-white'
                                            : 'bg-amber-500 text-white'
                                            }`}
                                    >
                                        {incidenciasPendientes > 99 ? '99+' : incidenciasPendientes}
                                    </span>
                                )}
                            </button>
                        </li>

                        {/* Confirmaciones */}
                        <li>
                            <button
                                onClick={() => {
                                    onGoTo('confirmaciones');
                                    closeSidebar();
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isConfirmacionesActive
                                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                    }`}
                            >
                                <ClipboardCheck className="w-5 h-5" />
                                <span>Confirmaciones</span>
                            </button>
                        </li>
                    </ul>
                </nav>

                {/* User footer */}
                <div className="p-4 border-t border-sidebar-border space-y-3">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                            G
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-sidebar-foreground font-semibold">Gestor</p>
                            <p className="text-xs text-muted-foreground truncate">gestor@uniformespro.com</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            if (onLogout) onLogout();
                            closeSidebar(); // <-- Asegura cerrar el estado en móvil
                        }}
                        title="Cerrar sesión"
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground font-medium"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>
        </>
    );
}