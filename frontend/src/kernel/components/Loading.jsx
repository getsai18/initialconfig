export default function Loading({ overlay = false, message = 'Cargando...' }) {
  const content = (
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  )

  if (!overlay) return content

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-card border border-border rounded-xl shadow-xl p-6">
        {content}
      </div>
    </div>
  )
}
