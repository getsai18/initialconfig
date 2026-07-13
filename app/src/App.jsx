import { useState } from 'react'
import { PublicRouter } from '@/routes/PublicRouter'
import { AuthRouter } from '@/routes/AuthRouter'
import { UnimplementedRoleScreen } from '@/routes/UnimplementedRoleScreen'

const IMPLEMENTED_ROLES = ['ADMIN', 'SUB_ADMIN']

export default function App() {
  const [role, setRole] = useState(null)

  function handleLogin(newRole) {
    setRole(newRole)
  }

  function handleLogout() {
    sessionStorage.removeItem('token')
    setRole(null)
  }

  if (role === null) return <PublicRouter onLogin={handleLogin} />

  if (!IMPLEMENTED_ROLES.includes(role)) {
    return <UnimplementedRoleScreen role={role} onLogout={handleLogout} />
  }

  return <AuthRouter onLogout={handleLogout} isSubAdmin={role === 'SUB_ADMIN'} />
}
