import { useState } from 'react'
import { LoginForm } from './LoginForm'
import { RecoveryRequest } from './RecoveryRequest'
import { RecoveryVerify } from './RecoveryVerify'
import { RecoveryReset } from './RecoveryReset'
import { RecoverySuccess } from './RecoverySuccess'
import { FirstLoginReset } from './FirstLoginReset'

export function Login({ onLogin, usuarios = [], setUsuarios, areas = [] }) {
  const [recoveryStep, setRecoveryStep] = useState('login') 
  const [matchedUser, setMatchedUser] = useState(null)
  const [firstLoginPayload, setFirstLoginPayload] = useState(null)

  const resetToLogin = () => {
    setRecoveryStep('login')
    setMatchedUser(null)
    setFirstLoginPayload(null)
  }

  const handleFirstLogin = (payload) => {
    setFirstLoginPayload(payload)
    setRecoveryStep('first-login')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {recoveryStep === 'login' && (
          <LoginForm 
            onLogin={onLogin} 
            usuarios={usuarios} 
            areas={areas} 
            onForgotPassword={() => setRecoveryStep('request')} 
            onFirstLogin={handleFirstLogin}
          />
        )}

        {recoveryStep === 'request' && (
          <RecoveryRequest 
            usuarios={usuarios} 
            onSuccess={(user) => {
              setMatchedUser(user)
              setRecoveryStep('verify')
            }} 
            onBack={resetToLogin} 
          />
        )}

        {recoveryStep === 'verify' && (
          <RecoveryVerify 
            matchedUser={matchedUser} 
            onSuccess={() => setRecoveryStep('reset')} 
            onBack={() => setRecoveryStep('request')} 
          />
        )}

        {recoveryStep === 'reset' && (
          <RecoveryReset 
            matchedUser={matchedUser} 
            setUsuarios={setUsuarios} 
            onSuccess={() => setRecoveryStep('success')} 
            onBack={resetToLogin} 
          />
        )}

        {recoveryStep === 'success' && (
          <RecoverySuccess 
            onBack={resetToLogin} 
          />
        )}

        {recoveryStep === 'first-login' && (
          <FirstLoginReset
            payload={firstLoginPayload}
            onSuccess={onLogin}
            onBack={resetToLogin}
          />
        )}
      </div>
    </div>
  )
}