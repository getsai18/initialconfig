import { useState } from 'react'
import { LoginForm } from './LoginForm'
import { RecoveryRequest } from './RecoveryRequest'
import { RecoveryVerify } from './RecoveryVerify'
import { RecoveryReset } from './RecoveryReset'
import { RecoverySuccess } from './RecoverySuccess'

export function Login({ onLogin }) {
  const [recoveryStep, setRecoveryStep] = useState('login') 
  const [recoveryUsuario, setRecoveryUsuario] = useState('')
  const [resetToken, setResetToken] = useState('')

  const resetToLogin = () => {
    setRecoveryStep('login')
    setRecoveryUsuario('')
    setResetToken('')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {recoveryStep === 'login' && (
          <LoginForm 
            onLogin={onLogin} 
            onForgotPassword={() => setRecoveryStep('request')} 
          />
        )}

        {recoveryStep === 'request' && (
          <RecoveryRequest 
            onSuccess={(username) => {
              setRecoveryUsuario(username)
              setRecoveryStep('verify')
            }} 
            onBack={resetToLogin} 
          />
        )}

        {recoveryStep === 'verify' && (
          <RecoveryVerify 
            recoveryUsuario={recoveryUsuario} 
            onSuccess={(token) => {
              setResetToken(token)
              setRecoveryStep('reset')
            }} 
            onBack={() => setRecoveryStep('request')} 
          />
        )}

        {recoveryStep === 'reset' && (
          <RecoveryReset 
            recoveryUsuario={recoveryUsuario} 
            resetToken={resetToken} 
            onSuccess={() => setRecoveryStep('success')} 
            onBack={resetToLogin} 
          />
        )}

        {recoveryStep === 'success' && (
          <RecoverySuccess 
            onBack={resetToLogin} 
          />
        )}
      </div>
    </div>
  )
}