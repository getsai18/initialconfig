import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import AuthService from '@/modules/public/auth/services/AuthService'
import Loading from '@/kernel/components/Loading'

const GENERIC_ERROR = 'Ocurrió un error. Intenta nuevamente.'

export function LoginForm({ onLogin, onForgotPassword }) {
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setLoginError('')

    const usuarioInput = data.usuario.toLowerCase().trim()

    try {
      const result = await AuthService.login(usuarioInput, data.password)

      if (!result?.token) {
        setLoginError(result?.message || 'Usuario o contraseña incorrectos.')
        return
      }

      // Guardar sesión según la opción "Recordarme"
      const storage = data.recordarme ? localStorage : sessionStorage
      storage.setItem('token', result.token)
      storage.setItem('role', result.usuario?.role || '')

      onLogin?.(result.usuario?.role, result.usuario?.nombre)
    } catch (error) {
      console.error(error)
      setLoginError(GENERIC_ERROR)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-8 shadow-lg relative">
      {isSubmitting && <Loading overlay message="Iniciando sesión..." />}
      
      <div className="text-center mb-8">
        <h1 className="mb-2">UniformPro Manager</h1>
        <p className="text-muted-foreground">Inicia sesión para acceder al panel de control</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="usuario" className="block mb-2">Usuario</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              id="usuario"
              {...register('usuario', { 
                required: 'El usuario es requerido',
                maxLength: { value: 30, message: 'Máximo 30 caracteres' }
              })}
              type="text"
              placeholder="Ingresa tu usuario"
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring lowercase ${errors.usuario ? 'border-destructive' : 'border-border'}`}
            />
          </div>
          {errors.usuario && <p className="text-destructive text-sm mt-1">{errors.usuario.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block mb-2">Contraseña</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              id="password"
              {...register('password', { required: 'La contraseña es requerida' })}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`w-full pl-10 pr-12 py-2.5 rounded-lg border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring ${errors.password ? 'border-destructive' : 'border-border'}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-destructive text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              {...register('recordarme')} 
              className="w-4 h-4 rounded border-border bg-input-background" 
            />
            <span className="text-sm">Recordarme</span>
          </label>
          <button 
            type="button" 
            onClick={onForgotPassword} 
            className="text-sm text-primary hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {loginError && <p className="text-destructive text-sm text-center -mt-2">{loginError}</p>}

        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Iniciar Sesión
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>© 2026 UniformesPro. Todos los derechos reservados.</p>
      </div>
    </div>
  )
}
