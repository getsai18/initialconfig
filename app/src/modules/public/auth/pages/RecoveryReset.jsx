import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Lock, Eye, EyeOff } from 'lucide-react'
import AuthService from '@/modules/public/auth/services/AuthService'
import Loading from '@/kernel/components/Loading'

const GENERIC_ERROR = 'Ocurrió un error. Intenta nuevamente.'

export function RecoveryReset({ recoveryUsuario, resetToken, onSuccess, onBack }) {
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetPasswordError, setResetPasswordError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, watch } = useForm()

  const nuevaPassword = watch('nuevaPassword')

  const handleResetPasswordSubmit = async (data) => {
    if (!resetToken) {
      setResetPasswordError('Error en la sesión de recuperación. Reinicia el proceso.')
      return
    }

    setIsLoading(true)
    setResetPasswordError('')

    try {
      const result = await AuthService.resetPassword(resetToken, data.nuevaPassword)

      if (!result?.reset) {
        setResetPasswordError(result?.message || GENERIC_ERROR)
        return
      }

      onSuccess()
    } catch (error) {
      console.error(error)
      setResetPasswordError(GENERIC_ERROR)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-8 shadow-lg relative">
      {isLoading && <Loading overlay message="Restableciendo contraseña..." />}

      <div className="text-center mb-6">
        <h1 className="mb-2 text-xl font-bold">Nueva Contraseña</h1>
        <p className="text-sm text-muted-foreground">
          Establece la nueva clave de acceso para la cuenta de <strong>{recoveryUsuario}</strong>.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleResetPasswordSubmit)} className="space-y-5">
        <div>
          <label htmlFor="nuevaPassword" className="block text-sm font-medium mb-1.5">Nueva Contraseña</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="nuevaPassword"
              {...register('nuevaPassword', { 
                required: 'La contraseña es requerida',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' }
              })}
              type={showNewPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.nuevaPassword && <p className="text-destructive text-xs mt-1">{errors.nuevaPassword.message}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5">Confirmar Contraseña</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="confirmPassword"
              {...register('confirmPassword', { 
                required: 'Debes confirmar la contraseña',
                validate: value => value === nuevaPassword || 'Las contraseñas no coinciden'
              })}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-destructive text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        {resetPasswordError && <p className="text-destructive text-sm text-center">{resetPasswordError}</p>}

        <button 
          type="submit" 
          className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Restablecer Acceso
        </button>
        <div>
          <button 
            type="button" 
            onClick={onBack} 
            className="w-full bg-primary flex-1 bg-secondary text-secondary-foreground py-2 rounded-lg text-sm hover:opacity-50 transition-opacity border border-border"
          >
            Volver al Login
          </button>
        </div>
      </form>
    </div>
  )
}
