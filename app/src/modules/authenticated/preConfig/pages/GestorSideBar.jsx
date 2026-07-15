import { UserCircle, LogOut, ClipboardCheck, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/kernel/context/AuthContext';
import { Link } from 'react-router-dom';

export default function GestorSidebar({ screen, onLogout, incidenciasPendientes = 0 }) {
  const { user } = useAuth();
  const nombre = user?.nombre || 'Gestor';
  const email = user?.email || 'gestor@uniformespro.com';
  const inicial = nombre.charAt(0).toUpperCase();

  const isActive = ['clientes', 'pedidos', 'detalle-pedido', 'reutilizar', 'nueva-orden'].includes(screen);
  const isConfirmacionesActive = screen === 'confirmaciones';
  const isIncidenciasActive = screen === 'incidencias';

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col flex-shrink-0 sticky top-0 self-start overflow-y-auto">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-sidebar-foreground font-semibold">Gestión de Órdenes</h1>
        <p className="text-sm text-muted-foreground mt-1">Sistema de Gestión</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          <li>
            <Link
              to="/clientes"
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <UserCircle className="w-5 h-5" />
              <span className="font-medium">Clientes</span>
            </Link>
          </li>
          <li>
            <Link
              to="/confirmaciones"
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isConfirmacionesActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <ClipboardCheck className="w-5 h-5" />
              <span className="font-medium">Confirmaciones</span>
            </Link>
          </li>
          <li>
            <Link
              to="/incidencias"
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                isIncidenciasActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">Incidencias</span>
              </div>
              {incidenciasPendientes > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 text-white px-1.5 text-xs font-semibold">
                  {incidenciasPendientes}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
            {inicial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-sidebar-foreground truncate">{nombre}</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          title="Cerrar sesión"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}

