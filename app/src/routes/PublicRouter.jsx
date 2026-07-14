import { Login } from '@/modules/public/auth/pages/Login'

export function PublicRouter({ onLogin }) {
  return <Login onLogin={onLogin} />
}
