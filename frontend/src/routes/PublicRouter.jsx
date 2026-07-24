import { Login } from '@/modules/public/login/pages/Login'

export function PublicRouter({ onLogin }) {
  return <Login onLogin={onLogin} />
}
