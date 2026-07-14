import { useState } from 'react'
import { PublicRouter } from '@/routes/PublicRouter'
import { AuthRouter } from '@/routes/AuthRouter'
import { UnimplementedRoleScreen } from '@/routes/UnimplementedRoleScreen'

const IMPLEMENTED_ROLES = ['ADMIN', 'SUB_ADMIN']

export default function App() {
  const [role, setRole] = useState(() => {
    return sessionStorage.getItem('role') || localStorage.getItem('role') || null;
  });

  function handleLogin(newRole) {
    setRole(newRole)
  }

  function handleLogout() {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('role')
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    setRole(null)
  }

  if (role === null) return <PublicRouter onLogin={handleLogin} />

  if (!IMPLEMENTED_ROLES.includes(role)) {
    return <UnimplementedRoleScreen role={role} onLogout={handleLogout} />
  }

  return <AuthRouter onLogout={handleLogout} isSubAdmin={role === 'SUB_ADMIN'} />
}
