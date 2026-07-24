import { useState } from 'react';
import { X } from 'lucide-react';

export default function ClienteModal({ visible, clientes = [], onClose, onConfirm }) {
  if (!visible) return null;
  const [nombre, setNombre] = useState('');
  const [vendor, setVendor] = useState('');
  const [informacion, setInformacion] = useState('');
  const [touched, setTouched] = useState(false);

  const nombreTrim = nombre.trim();
  const vendorTrim = vendor.trim();
  const yaExiste = nombreTrim.length > 0 && clientes.some(c => c.nombre?.toLowerCase() === nombreTrim.toLowerCase());
  const error = !touched ? '' : !nombreTrim ? 'El nombre es requerido.' : !vendorTrim ? 'El representante es requerido.' : yaExiste ? 'Ya existe un equipo con ese nombre.' : '';

  function reset() {
    setNombre('');
    setVendor('');
    setInformacion('');
    setTouched(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleConfirm() {
    setTouched(true);
    if (!nombreTrim || !vendorTrim || yaExiste) return;
    onConfirm({ nombre: nombreTrim, vendor: vendorTrim, informacion: informacion.trim() });
    reset();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl p-5">
        <div className="flex items-start justify-between pb-4 border-b border-border mb-4">
          <div>
            <div className="text-base font-bold text-foreground">Nuevo equipo</div>
            <div className="text-xs text-muted-foreground mt-0.5">Registra un equipo y su representante</div>
          </div>
          <button onClick={handleClose} className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3 mb-4">
          <div>
            <label className="text-sm font-medium text-foreground">Nombre del equipo<span className="text-red-500">*</span></label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring outline-none text-sm mt-1"
              placeholder="Ej. Los Tigres"
            />
            {error && <span className="text-xs text-destructive mt-1 block">{error}</span>}
          </div>
      
          <div>
            <label className="text-sm font-medium text-foreground">Nombre del Representante<span className="text-red-500">*</span></label>
            <input
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring outline-none text-sm mt-1"
              placeholder="Ej. Juan Pérez"
            />
            {touched && !vendorTrim && <span className="text-xs text-destructive mt-1 block">El representante es requerido.</span>}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Información adicional</label>
            <textarea
              value={informacion}
              onChange={(e) => setInformacion(e.target.value)}
              className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring outline-none text-sm mt-1"
              placeholder="Ej. Información adicional del equipo"
              rows={3}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={handleClose} className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-accent">Cancelar</button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Registrar equipo
          </button>
        </div>
      </div>
    </div>
  );
}
