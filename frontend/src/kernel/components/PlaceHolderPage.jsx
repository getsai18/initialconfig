import { Construction } from 'lucide-react'

export function PlaceHolderPage({ title, description = 'Esta sección está pendiente de implementación.' }) {
  return (
    <div className="p-6 flex items-center justify-center min-h-[60vh]">
      <div className="bg-card border border-border rounded-xl shadow-sm w-full max-w-md p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Construction className="w-6 h-6 text-primary" />
        </div>
        <h2 className="mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
