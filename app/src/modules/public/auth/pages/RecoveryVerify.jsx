import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { KeyRound } from 'lucide-react'
import AuthService from '@/modules/public/auth/services/AuthService'
import Loading from '@/kernel/components/Loading'

const GENERIC_ERROR = 'Ocurrió un error. Intenta nuevamente.'

export function RecoveryVerify({ recoveryUsuario, onSuccess, onBack }) {
  const [verificationError, setVerificationError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const handleVerifyCodeSubmit = async (data) => {
    setIsLoading(true)
    setVerificationError('')

    try {
      const result = await AuthService.verifyPasswordRecovery(recoveryUsuario, data.otpCode)

      if (!result?.resetToken) {
        setVerificationError(result?.message || 'El código ingresado es incorrecto o ha expirado.')
        return
      }

      onSuccess(result.resetToken)
    } catch (error) {
      console.error(error)
      setVerificationError(GENERIC_ERROR)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-8 shadow-lg relative">
      {isLoading && <Loading overlay message="Validando código..." />}

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
          <button 
            type="button" 
            onClick={onBack} 
            className="flex-1 bg-secondary text-secondary-foreground py-2 rounded-lg text-sm hover:opacity-50 transition-opacity border border-border"
          >
            Atrás
          </button>
          <button 
            type="submit" 
            className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
          >
            Validar Código
          </button>
        </div>
      </form>
    </div>
  )
}
