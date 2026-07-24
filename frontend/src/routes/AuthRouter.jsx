import { useLocation, Navigate } from 'react-router-dom'
import { AdminLayout } from '@/layouts/AdminLayout'
import OrderManagerLayout from '@/layouts/OrderManagerLayout'
import { useAuth } from '@/kernel/context/AuthContext'

export function AuthRouter({ onLogout }) {
  const { role, isSubAdmin, isManagement } = useAuth()
  const location = useLocation()

  if (role === 'MANAGEMENT' || isManagement) {
    if (location.pathname === '/') {
      return <Navigate to="/clientes" replace />
    }
    return <OrderManagerLayout onLogout={onLogout} />
  }

  return <AdminLayout onLogout={onLogout} isSubAdmin={isSubAdmin} />
}

