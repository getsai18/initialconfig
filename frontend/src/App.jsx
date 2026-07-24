import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/kernel/context/AuthContext'
import { PublicRouter } from '@/routes/PublicRouter'
import { AuthRouter } from '@/routes/AuthRouter'
import { UnimplementedRoleScreen } from '@/routes/UnimplementedRoleScreen'

const IMPLEMENTED_ROLES = ['ADMIN', 'SUB_ADMIN', 'MANAGEMENT']

function AppContent() {
  const { role, login, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogin = (newRole, newName, rawUser, token, recordarme) => {
    login(token, recordarme, newRole)
    navigate('/')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          role !== null ? (
            <Navigate to="/" replace />
          ) : (
            <PublicRouter onLogin={handleLogin} />
          )
        }
      />

      <Route
        path="/*"
        element={
          role === null ? (
            <Navigate to="/login" replace />
          ) : !IMPLEMENTED_ROLES.includes(role) ? (
            <UnimplementedRoleScreen role={role} onLogout={handleLogout} />
          ) : (
            <AuthRouter onLogout={handleLogout} />
          )
        }
      />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
