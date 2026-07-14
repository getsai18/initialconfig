import { Loader2 } from 'lucide-react';

export function Loading({ overlay = false, message = 'Cargando...', className = '' }) {
  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-300 ease-in-out">
        <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card border border-border shadow-xl max-w-xs w-full text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-foreground">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      {message && <span className="text-sm text-muted-foreground">{message}</span>}
    </div>
  );
}

export default Loading;
