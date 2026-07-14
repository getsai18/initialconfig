import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Lock, KeyRound } from 'lucide-react'
import ApiGateway from '@/kernel/api/ApiGateway'
const { doPost } = ApiGateway


export function FirstLoginReset({ payload, onSuccess, onBack }) {
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetError, setResetError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const nuevaPassword = watch('nuevaPassword')

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setResetError('')

    try {
      // Endpoint a implementar en el backend para cambiar contraseña en primer login
      const response = await doPost('/cpm-api/auth/change-password', {
        usuario: payload.usuario?.usuario || payload.usuario, // Dependiendo de la estructura
        nuevaPassword: data.nuevaPassword,
        esPrimerLogin: true
      })

      if (response?.error) {
        setResetError(response?.message || 'No se pudo actualizar la contraseña.')
        return
      }

      // Si todo sale bien, asumimos que ya se puede loguear o que el endpoint devuelve un nuevo token
      // Para efectos prácticos de este primer ingreso, guardamos el token original si no hay uno nuevo
      sessionStorage.setItem('token', response?.data?.token || payload.token)
      sessionStorage.setItem('currentUser', JSON.stringify(response?.data || payload))

      const userRes = response?.data?.usuario || response?.data || payload.usuario || payload
      const role = userRes.role || userRes.rol
      const area = userRes.areaNombre || null
      onSuccess(role, area)
    } catch (error) {
      console.error(error)
      setResetError('No fue posible conectar con el servidor.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <KeyRound className="w-6 h-6 text-primary" />
        </div>
        <h1 className="mb-2 text-xl font-bold">Actualiza tu contraseña</h1>
        <p className="text-sm text-muted-foreground">
          Por razones de seguridad, debes cambiar la contraseña autogenerada en tu primer inicio de sesión.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

        {resetError && <p className="text-destructive text-sm text-center">{resetError}</p>}

        <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed">
          {isSubmitting ? 'Guardando...' : 'Cambiar y Entrar'}
        </button>
        <div>
          <button type="button" onClick={onBack} className="w-full flex-1 bg-secondary text-secondary-foreground py-2.5 rounded-lg text-sm hover:opacity-90 transition-opacity border border-border">
            Cancelar y volver
          </button>
        </div>
      </form>
    </div>
  )
}
