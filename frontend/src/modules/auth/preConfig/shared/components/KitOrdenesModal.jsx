import { X, ClipboardList } from 'lucide-react';

export default function KitOrdenesModal({ visible, kitId, pedidoActivo, onClose, onConfirmar }) {
  if (!visible || !kitId || !pedidoActivo) return null;

  const kit = pedidoActivo.kits?.find(k => k.id === kitId);
  const ordenesSueltas = (pedidoActivo.ordenes || []).filter(o => !kit?.ordenIds?.includes(o.id));

  function handleConfirmar() {
    const checks = document.querySelectorAll('.modal-ord-check:checked');
    const selected = Array.from(checks).map(ch => ch.value);
    onConfirmar(kitId, selected);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl p-5">
        <div className="flex items-start justify-between pb-4 border-b border-border flex-shrink-0">
          <div>
            <div className="text-base font-bold text-foreground">Agregar órdenes al kit</div>
            <div className="text-xs text-muted-foreground mt-0.5">{kit?.nombre}</div>
          </div>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-3 space-y-2">
          {ordenesSueltas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ClipboardList className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
              <div className="text-sm">No hay órdenes sueltas disponibles para agregar a este kit.</div>
            </div>
          ) : (
            ordenesSueltas.map(o => {
              const tp = (o.clothes || []).reduce((s,c) => s + (c.conf?.tot || 0), 0);
              return (
                <label key={o.id} className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-accent/50 cursor-pointer">
                  <input type="checkbox" className="modal-ord-check w-4 h-4 rounded border-border" value={o.id} />
                  <div className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-foreground">{o.id}</span>
                    <span className="block text-xs text-muted-foreground font-mono mt-0.5">{o.code}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{tp} pzas</div>
                </label>
              );
            })
          )}
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t border-border flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-accent">Cancelar</button>
          <button onClick={handleConfirmar} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90">Agregar seleccionadas</button>
        </div>
      </div>
    </div>
  );
}
