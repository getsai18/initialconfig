import { useState } from 'react';
import { X } from 'lucide-react';

export default function KitModal({ visible, onClose, onConfirm }) {
  if (!visible) return null;
  const [nombre, setNombre] = useState('');

  function handleConfirm() {
    if (!nombre.trim()) return;
    onConfirm(nombre.trim());
    setNombre('');
  }

  function handleClose() {
    setNombre('');
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl p-5">
        <div className="flex items-start justify-between pb-4 border-b border-border mb-4">
          <div>
            <div className="text-base font-bold text-foreground">Nuevo kit</div>
            <div className="text-xs text-muted-foreground mt-0.5">Un kit agrupa varias órdenes</div>
          </div>
          <button onClick={handleClose} className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Nombre del kit</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Ej. Juego completo, Portero…"
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={handleClose} className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-accent">Cancelar</button>
          <button onClick={handleConfirm} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90">Crear kit</button>
        </div>
      </div>
    </div>
  );
}
