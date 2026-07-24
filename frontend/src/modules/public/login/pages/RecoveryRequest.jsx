import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { User, Mail } from 'lucide-react'
import AuthService from '@/modules/public/login/services/AuthService'
import Loading from '@/kernel/components/Loading'

const GENERIC_ERROR = 'Ocurrió un error. Intenta nuevamente.'

export function RecoveryRequest({ onSuccess, onBack }) {
  const [recoveryError, setRecoveryError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [recoverySent, setRecoverySent] = useState(() => sessionStorage.getItem('recoveryRequestSent') === 'true')
  const { register, handleSubmit, formState: { errors } } = useForm()

  const handleRecoverySubmit = async (data) => {
    if (sessionStorage.getItem('recoveryRequestSent') === 'true') {
      setRecoveryError('Ya has solicitado la recuperación de contraseña en esta sesión.')
      return
    }

    const userInput = data.recoveryUsuario.toLowerCase().trim()
    const emailInput = data.recoveryEmail.toLowerCase().trim()

    setIsLoading(true)
    setRecoveryError('')
    try {
      const result = await AuthService.requestPasswordRecovery(userInput, emailInput)

      if (!result?.sent) {
        setRecoveryError(result?.message || 'No se encontró ningún usuario que coincida con ese nombre y correo.')
        return
      }

      sessionStorage.setItem('recoveryRequestSent', 'true')
      setRecoverySent(true)
      onSuccess(userInput)
    } catch (error) {
      console.error(error)
      setRecoveryError(GENERIC_ERROR)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-8 shadow-lg relative">
      {isLoading && <Loading overlay message="Enviando código de recuperación..." />}

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
        {recoverySent && <p className="text-amber-500 text-xs text-center font-medium mt-2">Ya has solicitado la recuperación de contraseña en esta sesión.</p>}

        <div className="flex gap-3 pt-2">
          <button 
            type="button" 
            onClick={onBack} 
            className="flex-1 bg-secondary text-secondary-foreground py-2 rounded-lg text-sm hover:opacity-50 transition-opacity border border-border"
          >
            Volver al Login
          </button>
          <button 
            type="submit" 
            disabled={recoverySent} 
            className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg text-sm hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {recoverySent ? 'Solicitado' : 'Verificar Datos'}
          </button>
        </div>
      </form>
    </div>
  )
}
