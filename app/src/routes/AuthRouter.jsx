import { BrowserRouter } from 'react-router-dom'
import { AdminLayout } from '@/layouts/AdminLayout'
import OrderManager from '@/layouts/OrderManagerLayout'
import { useAuth } from '@/kernel/context/AuthContext'

export function AuthRouter({ onLogout, isSubAdmin }) {
  const { role } = useAuth()

  return (
    <BrowserRouter>
      {role === 'MANAGEMENT' ? (
        <OrderManager onLogout={onLogout} />
      ) : (
        <AdminLayout onLogout={onLogout} isSubAdmin={isSubAdmin} />
      )}
    </BrowserRouter>
  )
}

