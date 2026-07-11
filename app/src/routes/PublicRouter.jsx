import { LoginPage } from '@/modules/public/auth/pages/LoginPage'

export function PublicRouter({ onLogin }) {
  return <LoginPage onLogin={onLogin} />
}
