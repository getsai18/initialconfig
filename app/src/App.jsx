import { useState } from 'react'
import { PublicRouter } from '@/routes/PublicRouter'
import { AuthRouter } from '@/routes/AuthRouter'
import { UnimplementedRoleScreen } from '@/routes/UnimplementedRoleScreen'
import OrderManager from '@/modules/authenticated/preConfig/pages/OrderManager'

const IMPLEMENTED_ROLES = ['ADMIN', 'SUB_ADMIN', 'MANAGEMENT']

export default function App() {
  const [role, setRole] = useState(null)

  function handleLogin(newRole) {
    setRole(newRole?.toUpperCase())
  }

  function handleLogout() {
    sessionStorage.removeItem('token')
    setRole(null)
  }

  if (role === null) return <PublicRouter onLogin={handleLogin} />

  if (!IMPLEMENTED_ROLES.includes(role)) {
    return <UnimplementedRoleScreen role={role} onLogout={handleLogout} />
  }

  if (role === 'MANAGEMENT') {
    return <OrderManager onLogout={handleLogout} />
  }

  return <AuthRouter onLogout={handleLogout} isSubAdmin={role === 'SUB_ADMIN'} />
}
