import { CheckCircle } from 'lucide-react'

export function SuccessModal({ 
  isOpen,
  onClose,
  title,
  message,
  buttonText = "Aceptar"
}) {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-sm mx-4 p-6" onClick={e => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-center mb-2">{title}</h2>
        <div className="text-center text-sm text-muted-foreground mb-6">
          {message}
        </div>
        <div className="flex justify-center">
          <button 
            onClick={onClose} 
            className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  )
}