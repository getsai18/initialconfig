import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Lock, User, Mail, KeyRound, CheckCircle2 } from 'lucide-react'
import AuthService from '@/modules/public/auth/services/AuthService'
import Loading from '@/kernel/components/Loading'

const GENERIC_ERROR = 'Ocurrió un error. Intenta nuevamente.'

export function LoginPage({ onLogin }) {
  // Estados de Vista Generales
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Control de flujo secuencial sin modular externo: 'login', 'request', 'verify', 'reset', 'success'
  const [recoveryStep, setRecoveryStep] = useState('login')
  const [recoveryUsuario, setRecoveryUsuario] = useState('')
  const [resetToken, setResetToken] = useState('')

  // Errores y Mensajes de Feedback
  const [loginError, setLoginError] = useState('')
  const [recoveryError, setRecoveryError] = useState('')
  const [verificationError, setVerificationError] = useState('')
  const [resetPasswordError, setResetPasswordError] = useState('')

  // Estados de Carga y Restricción
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Procesando...')
  const [recoverySent, setRecoverySent] = useState(() => sessionStorage.getItem('recoveryRequestSent') === 'true')

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm()

  // Observador de contraseñas para validación cruzada en el paso final
  const nuevaPassword = watch('nuevaPassword')

  // --- PASO 1: SUBMIT DEL LOGIN TRADICIONAL ---
  const onSubmit = async (data) => {
    const usuarioInput = data.usuario.toLowerCase().trim()

    setLoadingMessage('Iniciando sesión...')
    setIsLoading(true)
    setLoginError('')
    try {
      const result = await AuthService.login(usuarioInput, data.password)

      if (!result?.token) {
        setLoginError(result?.message || 'Usuario o contraseña incorrectos.')
        return
      }

      // Check if "Recordarme" is selected
      const storage = data.recordarme ? localStorage : sessionStorage
      storage.setItem('token', result.token)
      storage.setItem('role', result.usuario?.role || '')

      onLogin(result.usuario?.role, result.usuario?.nombre)
    } catch (error) {
      setLoginError(GENERIC_ERROR)
    } finally {
      setIsLoading(false)
    }
  }

  // --- PASO 2: FORMULARIO DE SOLICITUD (USUARIO + CORREO) ---
  const handleRecoverySubmit = async (data) => {
    if (sessionStorage.getItem('recoveryRequestSent') === 'true') {
      setRecoveryError('Ya has solicitado la recuperación de contraseña en esta sesión.')
      return
    }

    const userInput = data.recoveryUsuario.toLowerCase().trim()
    const emailInput = data.recoveryEmail.toLowerCase().trim()

    setLoadingMessage('Enviando código de recuperación...')
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
      setRecoveryError('')
      setRecoveryUsuario(userInput)
      // Saltamos al paso de Verificación de Código OTP
      setRecoveryStep('verify')
      reset()
    } catch (error) {
      setRecoveryError(GENERIC_ERROR)
    } finally {
      setIsLoading(false)
    }
  }

  // --- PASO 3: PANTALLA DE VERIFICACIÓN DE CÓDIGO ---
  const handleVerifyCodeSubmit = async (data) => {
    setLoadingMessage('Validando código...')
    setIsLoading(true)
    setVerificationError('')
    try {
      const result = await AuthService.verifyPasswordRecovery(recoveryUsuario, data.otpCode)

      if (!result?.resetToken) {
        setVerificationError(result?.message || 'El código ingresado es incorrecto o ha expirado.')
        return
      }

      setVerificationError('')
      setResetToken(result.resetToken)
      setRecoveryStep('reset')
      reset()
    } catch (error) {
      setVerificationError(GENERIC_ERROR)
    } finally {
      setIsLoading(false)
    }
  }

  // --- PASO 4: CAMBIO FORMAL DE CONTRASEÑA ---
  const handleResetPasswordSubmit = async (data) => {
    if (!resetToken) {
      setResetPasswordError('Error en la sesión de recuperación. Reinicia el proceso.')
      return
    }

    setLoadingMessage('Restableciendo contraseña...')
    setIsLoading(true)
    setResetPasswordError('')
    try {
      const result = await AuthService.resetPassword(resetToken, data.nuevaPassword)

      if (!result?.reset) {
        setResetPasswordError(result?.message || GENERIC_ERROR)
        return
      }

      // Limpiar la restricción de envío ya que se completó con éxito
      sessionStorage.removeItem('recoveryRequestSent')
      setRecoverySent(false)

      setResetPasswordError('')
      setRecoveryStep('success')
      reset()
    } catch (error) {
      setResetPasswordError(GENERIC_ERROR)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper para limpiar estados al regresar por completo
  const resetToLogin = () => {
    setRecoveryStep('login')
    setRecoveryUsuario('')
    setResetToken('')
    setLoginError('')
    setRecoveryError('')
    setVerificationError('')
    setResetPasswordError('')
    reset()
  }


  // ==========================================
  // RENDER PANTALLA: SOLICITUD DE RECUPERACIÓN
  // ==========================================
  if (recoveryStep === 'request') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        {isLoading && <Loading overlay message={loadingMessage} />}
        <div className="w-full max-w-md">
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
              {recoverySent && <p className="text-amber-500 text-xs text-center font-medium mt-2">Ya has solicitado la recuperación de contraseña en esta sesión.</p>}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={resetToLogin} className="flex-1 bg-secondary text-secondary-foreground py-2 rounded-lg text-sm hover:opacity-50 transition-opacity border border-border">
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
        </div>
      </div>
    )
  }

  // ==========================================
  // RENDER PANTALLA: VERIFICACIÓN DE CÓDIGO OT
  // ==========================================
  if (recoveryStep === 'verify') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        {isLoading && <Loading overlay message={loadingMessage} />}
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <KeyRound className="w-6 h-6 text-primary" />
              </div>
              <h1 className="mb-2 text-xl font-bold">Verifica tu Identidad</h1>
              <p className="text-sm text-muted-foreground">
                Hemos enviado un código de seguridad al correo vinculado a la cuenta <strong>{recoveryUsuario}</strong>.
              </p>
            </div>

            <form onSubmit={handleSubmit(handleVerifyCodeSubmit)} className="space-y-5">
              <div>
                <label htmlFor="otpCode" className="block text-sm font-medium mb-1.5 text-center">Código de Validación</label>
                <input
                  id="otpCode"
                  {...register('otpCode', {
                    required: 'El código es requerido',
                    minLength: { value: 6, message: 'El código debe tener 6 dígitos' },
                    maxLength: { value: 6, message: 'El código debe tener 6 dígitos' }
                  })}
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  className="w-full tracking-[0.5em] text-center font-mono font-bold text-xl py-3 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {errors.otpCode && <p className="text-destructive text-xs text-center mt-1">{errors.otpCode.message}</p>}
              </div>

              {verificationError && <p className="text-destructive text-sm text-center">{verificationError}</p>}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setRecoveryStep('request')} className="flex-1 bg-secondary text-secondary-foreground py-2 rounded-lg text-sm hover:opacity-90 transition-opacity border border-border">
                  Atrás
                </button>
                <button type="submit" className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg text-sm hover:opacity-90 transition-opacity">
                  Validar Código
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // ==========================================
  // RENDER PANTALLA: RESTABLECER CONTRASEÑA (Paso 4)
  // ==========================================
  if (recoveryStep === 'reset') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        {isLoading && <Loading overlay message={loadingMessage} />}
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
            <div className="text-center mb-6">
              <h1 className="mb-2 text-xl font-bold">Nueva Contraseña</h1>
              <p className="text-sm text-muted-foreground">
                Establece la nueva clave de acceso para el usuario <strong>{recoveryUsuario}</strong>.
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

              <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                Restablecer Acceso
              </button>
              <div>
                <button type="button" onClick={resetToLogin} className="w-full bg-primary flex-1 bg-secondary text-secondary-foreground py-2 rounded-lg text-sm hover:opacity-90 transition-opacity border border-border">
                  Volver al Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // ==========================================
  // RENDER PANTALLA: PANTALLA DE ÉXITO FINAL
  // ==========================================
  if (recoveryStep === 'success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">¡Contraseña Cambiada!</h1>
            <p className="text-sm text-muted-foreground mb-6">
              La contraseña se ha actualizado exitosamente. Ya puedes iniciar sesión con tus nuevas credenciales.
            </p>
            <button
              onClick={resetToLogin}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Volver al Inicio de Sesión
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ==========================================
  // RENDER PANTALLA: LOGIN PRINCIPAL (Paso 1)
  // ==========================================
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {isLoading && <Loading overlay message={loadingMessage} />}
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
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
                onClick={() => {
                  setRecoveryStep('request')
                  reset()
                }}
                className="text-sm text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {loginError && <p className="text-destructive text-sm text-center -mt-2">{loginError}</p>}

            <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg hover:opacity-90 transition-opacity">
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>© 2026 UniformesPro. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
