import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { User, Mail } from 'lucide-react'

export function RecoveryRequest({ usuarios = [], onSuccess, onBack }) {
  const [recoveryError, setRecoveryError] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm()

  const handleRecoverySubmit = (data) => {
    const userInput = data.recoveryUsuario.toLowerCase().trim()
    const emailInput = data.recoveryEmail.toLowerCase().trim()

    const match = usuarios.find(
      u => u.usuario?.toLowerCase().trim() === userInput && 
           u.email?.toLowerCase().trim() === emailInput
    )

    if (!match) {
      setRecoveryError('No se encontró ningún usuario que coincida con ese nombre y correo.')
      return
    }

    setRecoveryError('')
    onSuccess(match)
  }

  return (
    <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
      <div className="text-center mb-6">
        <h1 className="mb-2 text-xl font-bold">Recuperar Contraseña</h1>
        <p className="text-sm text-muted-foreground">
          Ingresa tu usuario y el correo vinculado a tu cuenta para restablecer el acceso.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleRecoverySubmit)} className="space-y-5">
        <div>
          <label htmlFor="recoveryUsuario" className="block text-sm font-medium mb-1.5">Usuario</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="recoveryUsuario"
              {...register('recoveryUsuario', { required: 'El usuario es requerido' })}
              type="text"
              placeholder="Ej. corte"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring lowercase"
            />
          </div>
          {errors.recoveryUsuario && <p className="text-destructive text-xs mt-1">{errors.recoveryUsuario.message}</p>}
        </div>

        <div>
          <label htmlFor="recoveryEmail" className="block text-sm font-medium mb-1.5">Correo Electrónico</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="recoveryEmail"
              {...register('recoveryEmail', { 
                required: 'El correo es requerido',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido' }
              })}
              type="email"
              placeholder="area@uniformespro.com"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {errors.recoveryEmail && <p className="text-destructive text-xs mt-1">{errors.recoveryEmail.message}</p>}
        </div>

        {recoveryError && <p className="text-destructive text-sm text-center">{recoveryError}</p>}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onBack} className="flex-1 bg-secondary text-secondary-foreground py-2 rounded-lg text-sm hover:opacity-90 transition-opacity border border-border">
            Volver al Login
          </button>
          <button type="submit" className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg text-sm hover:opacity-90 transition-opacity">
            Verificar Datos
          </button>
        </div>
      </form>
    </div>
  )
}
