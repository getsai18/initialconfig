import { useState } from 'react';
import { X, AlertCircle, Users, UserCircle } from 'lucide-react';

export default function ClienteModal({ visible, clientes, onClose, onConfirm }) {
  const [nombre, setNombre] = useState('');
  const [vendor, setVendor] = useState('');
  const [informacion, setInformacion] = useState('');
  const [touched, setTouched] = useState(false);

  const nombreTrim = nombre.trim();
  const vendorTrim = vendor.trim();
  const yaExiste = nombreTrim.length > 0 && clientes.some(c => c.nombre.toLowerCase() === nombreTrim.toLowerCase());
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
      className={`modal-overlay${visible ? ' visible' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="modal-box bg-white border border-gray-200 rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <div className="text-base font-bold text-gray-900">Nuevo equipo</div>
            <div className="text-xs text-gray-400 mt-0.5">Registra un equipo y su representante</div>
          </div>
          <button onClick={handleClose} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />  
          </button>
        </div>
        <div className="px-5 py-3 space-y-2">
            <div className="">
              <label className="text-sm font-medium text-foreground">Nombre del equipo<span className="text-red-500">*</span></label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                placeholder="Ej. Los Tigres"
              />
              
              {error && <span className="text-xs text-destructive">{error}</span>}
            </div>
        
            <div className="">
              <label className="text-sm font-medium text-foreground">Nombre del Representante<span className="text-red-500">*</span></label>
              <input
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                placeholder="Ej. Juan Pérez"
              />
              {touched && !vendorTrim && <span className="text-xs text-destructive">El representante es requerido.</span>}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Información adicional</label>
              <textarea
                value={informacion}
                onChange={(e) => setInformacion(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                placeholder="Ej. Información adicional del equipo"
                rows={3}
              />
            </div>
        </div>
        <div className="flex justify-end gap-2 px-5 pb-5">
          <button onClick={handleClose} className="px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50">Cancelar</button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium bg-[#050314] text-white rounded-lg hover:bg-gray-800"
          >
            Registrar equipo
          </button>
        </div>
      </div>
    </div>
  );
}
