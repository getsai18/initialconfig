import { ChevronLeft } from 'lucide-react';

export default function ReutilizarScreen({ pedidoActivo, onGoTo, onConfirmarReutilizar }) {
  if (!pedidoActivo) return null;

  const orden = (pedidoActivo.ordenes || [])[0];

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Reutilizar diseño</h1>
          <p className="text-sm text-muted-foreground mt-1">Se copiará la configuración del pedido seleccionado</p>
        </div>
        <button
          onClick={() => onGoTo('pedidos')}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-accent"
        >
          <ChevronLeft className="w-4 h-4" /> Volver
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold text-foreground">Diseño de {pedidoActivo.id}</div>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            Listo para reutilizar
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 my-3 text-sm">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Código origen</div>
            <div className="font-mono text-xs text-primary">{orden?.code || '—'}</div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Prendas</div>
            <div className="text-sm text-foreground">{(orden?.clothes || []).map(c => c.name).join(', ') || '—'}</div>
          </div>
        </div>
        <div className="border-t border-border mt-3 pt-3 text-xs text-muted-foreground">
          Se copiarán: tipos de prenda y configuración de áreas. Las cantidades deberán capturarse nuevamente.
        </div>
      </div>

      <div className="flex gap-2 justify-end mt-4">
        <button
          onClick={() => onGoTo('pedidos')}
          className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-accent"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirmarReutilizar}
          className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          Crear nueva orden con este diseño
        </button>
      </div>
    </div>
  );
}
