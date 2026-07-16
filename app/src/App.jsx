import { AuthProvider, useAuth } from '@/kernel/context/AuthContext'
import { PublicRouter } from '@/routes/PublicRouter'
import { AuthRouter } from '@/routes/AuthRouter'
import { UnimplementedRoleScreen } from '@/routes/UnimplementedRoleScreen'

const IMPLEMENTED_ROLES = ['ADMIN', 'SUB_ADMIN', 'MANAGEMENT']

function AppContent() {
  const { role, login, logout } = useAuth()

  if (role === null) {
    return (
      <PublicRouter
        onLogin={(newRole, newName, rawUser, token, recordarme) => {
          login(token, recordarme)
        }}
      />
    )
  }

  if (!IMPLEMENTED_ROLES.includes(role)) {
    return <UnimplementedRoleScreen role={role} onLogout={logout} />
  }

  return <AuthRouter onLogout={logout} />
}

import { Toaster } from 'react-hot-toast'

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="bottom-right" reverseOrder={false} />
      <AppContent />
    </AuthProvider>
  )
}
