import { Construction } from 'lucide-react'
import { ROLE_LABELS } from '@/kernel/auth/roleLabels'

export function UnimplementedRoleScreen({ role, onLogout }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-sm w-full max-w-md p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Construction className="w-6 h-6 text-primary" />
        </div>
        <h2 className="mb-2">{ROLE_LABELS[role] || role}</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Esta vista todavía no está implementada para tu rol.
        </p>
        <button
          onClick={onLogout}
          className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
