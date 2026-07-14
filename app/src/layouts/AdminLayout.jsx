import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { LayoutDashboard, Users, Building2, Activity, UserCircle, Shirt, FileText, ClipboardCheck } from 'lucide-react'
import { Sidebar } from '@/layouts/Sidebar'
import LogoutModal from '@/kernel/components/LogoutModal'
import { PlaceholderPage } from '@/kernel/components/PlaceholderPage'
import { UsersPage } from '@/modules/authenticated/initialConfig/users/pages/UsersPage'
import { AreasPage } from '@/modules/authenticated/initialConfig/areas/pages/AreasPage'
import { ActivitiesPage } from '@/modules/authenticated/initialConfig/activities/pages/ActivitiesPage'
import { DashboardPage } from '@/modules/authenticated/initialConfig/dashboard/pages/DashboardPage'
import { ClientesPage } from '@/modules/authenticated/initialConfig/clientes/pages/ClientesPage'
import { PrendasPage } from '@/modules/authenticated/initialConfig/prendas/pages/PrendasPage'

export function AdminLayout({ onLogout, isSubAdmin }) {
  const adminMenuItems = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard, path: '/inicio' },
    { id: 'usuarios', label: 'Usuarios', icon: Users, path: '/usuarios' },
    { id: 'areas', label: 'Áreas', icon: Building2, path: '/areas' },
    { id: 'actividades', label: 'Actividades', icon: Activity, path: '/actividades' },
    { id: 'clientes', label: 'Clientes', icon: UserCircle, path: '/clientes' },
    { id: 'tipos-prendas', label: 'Tipos de Prendas', icon: Shirt, path: '/tipos-prendas' },
    { id: 'incidencias', label: 'Incidencias', icon: FileText, path: '/incidencias' },
    { id: 'confirmaciones', label: 'Confirmaciones de Material', icon: ClipboardCheck, path: '/confirmaciones' },
  ]

  const adminUser = isSubAdmin
    ? {
        initials: 'S',
        role: 'Subadministrador',
        name: 'subadmin@uniformespro.com'
      }
    : {
        initials: 'A',
        role: 'Administrador',
        name: 'admin@uniformespro.com.com'
      };

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background flex-col md:flex-row">
      <Sidebar
        title="UniformesPro"
        subtitle="Sistema de Gestión"
        menuItems={adminMenuItems}
        user={adminUser}
        onLogout={() => setIsLogoutModalOpen(true)}
      />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/inicio" replace />} />
          <Route path="/inicio" element={<DashboardPage />} />
          <Route path="/usuarios" element={<UsersPage isSubAdmin={isSubAdmin} />} />
          <Route path="/areas" element={<AreasPage isSubAdmin={isSubAdmin} />} />
          <Route path="/actividades" element={<ActivitiesPage isSubAdmin={isSubAdmin} />} />
          <Route path="/clientes" element={<ClientesPage isSubAdmin={isSubAdmin} />} />
          <Route path="/tipos-prendas" element={<PrendasPage isSubAdmin={isSubAdmin} />} />
          <Route path="/incidencias" element={<PlaceholderPage title="Incidencias" />} />
          <Route path="/confirmaciones" element={<PlaceholderPage title="Confirmaciones de Material" />} />
        </Routes>
      </main>
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          window.history.replaceState(null, '', '/');
          onLogout?.();
        }}
      />
    </div>
  )
}
