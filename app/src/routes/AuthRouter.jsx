import { AdminLayout } from '@/layouts/AdminLayout'

export function AuthRouter({ onLogout, isSubAdmin }) {
    return (
        <AdminLayout onLogout={onLogout} isSubAdmin={isSubAdmin} />
    )
}
