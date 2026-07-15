import { UserCircle, LogOut, ClipboardCheck } from 'lucide-react';

export default function GestorSidebar({ screen, onGoTo, onLogout }) {
  const isActive = ['clientes', 'pedidos', 'detalle-pedido', 'reutilizar'].includes(screen);
  const isConfirmacionesActive = screen === 'confirmaciones';

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col flex-shrink-0 sticky top-0 self-start overflow-y-auto">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-sidebar-foreground font-semibold">Gestión de Órdenes</h1>
        <p className="text-sm text-muted-foreground mt-1">Sistema de Gestión</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => onGoTo('clientes')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <UserCircle className="w-5 h-5" />
              <span>Clientes</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => onGoTo('confirmaciones')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isConfirmacionesActive
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

      <div className="p-4 border-t border-sidebar-border space-y-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
            G
          </div>
          <div className="flex-1">
            <p className="text-sm text-sidebar-foreground">Gestor</p>
            <p className="text-xs text-muted-foreground">ordenes@uniformespro.com</p>
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
