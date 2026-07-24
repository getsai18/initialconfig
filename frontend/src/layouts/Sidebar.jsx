import { useState, useEffect } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// ── Shared layout shell ───────────────────────────────────────────────────────
function SidebarShell({
  title,
  subtitle,
  menuItems,
  user,
  onLogout,
  renderItem,
}) {
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

  return (
    <>
      {/* 📱 Mobile Header (Visible solo en tablet/móvil) */}
      <div className="md:hidden flex items-center justify-between p-4 bg-sidebar border-b border-sidebar-border sticky top-0 z-30 shrink-0">
        <div className="flex flex-col overflow-hidden">
          <h1 className="text-sidebar-foreground font-bold text-lg truncate leading-tight">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 ml-2 text-sidebar-foreground rounded-md hover:bg-sidebar-accent transition-colors"
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

      {/* 💻 Sidebar Principal (Comportamiento Fixed en móvil, Sticky en Desktop) */}
      <aside
        className={`
        w-64 bg-sidebar border-r border-sidebar-border h-dvh flex flex-col flex-shrink-0
          fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
          md:sticky md:top-0 md:translate-x-0
          ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}
      >
        <div className="p-6 border-b border-sidebar-border relative">
          <h1 className="text-sidebar-foreground font-bold text-lg pr-6">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>

          {/* Botón de cerrar (solo en móvil) */}
          <button
            onClick={closeSidebar}
            className="md:hidden absolute top-5 right-4 p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map(item => (
              <li key={item.id}>{renderItem(item, closeSidebar)}</li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-3">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-sm font-bold uppercase shrink-0">
              {user?.initials || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm text-sidebar-foreground font-semibold truncate">{user?.role || 'Usuario'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.name || ''}</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (onLogout) onLogout();
              closeSidebar();
            }}
            title="Cerrar sesión"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}

// ── Router-based (Admin) ──────────────────────────────────────────────────────
function SidebarRouted({ title, subtitle, menuItems, user, onLogout }) {
  const location = useLocation();

  function renderItem(item, closeSidebar) {
    const isActive =
      location.pathname === item.path ||
      (item.path !== '/' && location.pathname.startsWith(item.path)) ||
      (item.id === 'pedidos' && location.pathname === '/actividades');

    return (
      <Link
        to={item.path}
        onClick={closeSidebar} // <-- Cierra el menú al navegar en móvil
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
          isActive
            ? 'bg-sidebar-primary text-sidebar-primary-foreground'
            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        }`}
      >
        <div className="flex items-center gap-3">
          <item.icon className="w-5 h-5" />
          <span className="font-medium">{item.label}</span>
        </div>
        {item.badge != null && item.badge > 0 && (
          <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            {item.badge}
          </span>
        )}
      </Link>
    );
  }

  return <SidebarShell title={title} subtitle={subtitle} menuItems={menuItems} user={user} onLogout={onLogout} renderItem={renderItem} />;
}

// ── State-based (Employee) ────────────────────────────────────────────────────
function SidebarStateful({ title, subtitle, menuItems, user, onLogout, activeId, onItemClick }) {
  function renderItem(item, closeSidebar) {
    const isActive = item.id === activeId;
    return (
      <button
        onClick={() => {
          onItemClick(item);
          closeSidebar(); // <-- Cierra el menú al seleccionar en móvil
        }}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
          isActive
            ? 'bg-sidebar-primary text-sidebar-primary-foreground'
            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        }`}
      >
        <div className="flex items-center gap-3">
          <item.icon className="w-5 h-5" />
          <span className="font-medium">{item.label}</span>
        </div>
        {item.badge != null && item.badge > 0 && (
          <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            {item.badge}
          </span>
        )}
      </button>
    );
  }

  return <SidebarShell title={title} subtitle={subtitle} menuItems={menuItems} user={user} onLogout={onLogout} renderItem={renderItem} />;
}

// ── Public export — auto-selects mode ────────────────────────────────────────
export function Sidebar(props) {
  if (props.activeId !== undefined && props.onItemClick !== undefined) {
    return <SidebarStateful {...props} />;
  }
  return <SidebarRouted {...props} />;
}
