import { useState } from 'react'
import { PublicRouter } from '@/routes/PublicRouter'
import { AuthRouter } from '@/routes/AuthRouter'

export default function App() {
  const [role, setRole] = useState(null)

  function handleLogin(newRole) {
    setRole(newRole)
  }

  function handleLogout() {
    setRole(null)
  }

  if (role === null) return <PublicRouter onLogin={handleLogin} />

  return <AuthRouter onLogout={handleLogout} isSubAdmin={role === 'subadmin'} />
}
