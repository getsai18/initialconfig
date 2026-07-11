import { BrowserRouter } from 'react-router-dom'
import { AdminLayout } from '@/layouts/AdminLayout'

export function AuthRouter({ onLogout, isSubAdmin }) {
  return (
    <BrowserRouter>
      <AdminLayout onLogout={onLogout} isSubAdmin={isSubAdmin} />
    </BrowserRouter>
  )
}
