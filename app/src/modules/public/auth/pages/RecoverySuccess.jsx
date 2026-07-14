import { CheckCircle2 } from 'lucide-react'

export function RecoverySuccess({ onBack }) {
  return (
    <div className="bg-card border border-border rounded-lg p-8 shadow-lg text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-10 h-10 text-green-600" />
      </div>
      <h1 className="text-2xl font-bold mb-2">¡Contraseña Cambiada!</h1>
      <p className="text-sm text-muted-foreground mb-6">
        La contraseña se ha actualizado exitosamente. Ya puedes iniciar sesión con tus nuevas credenciales.
      </p>
      <button 
        onClick={onBack} 
        className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Volver al Inicio de Sesión
      </button>
    </div>
  )
}
