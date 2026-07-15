import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

export default function KitModal({ visible, onClose, onConfirm }) {
  const [nombre, setNombre] = useState('');
  const [touched, setTouched] = useState(false);
  const hasError = touched && !nombre.trim();

  function handleConfirm() {
    setTouched(true);
    if (!nombre.trim()) return;
    onConfirm(nombre.trim());
    setNombre('');
    setTouched(false);
  }

  function handleClose() {
    setNombre('');
    setTouched(false);
    onClose();
  }

  return (
    <div
      className={`modal-overlay${visible ? ' visible' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="modal-box bg-white border border-gray-200 rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <div className="text-base font-bold text-gray-900">Nuevo kit</div>
            <div className="text-xs text-gray-400 mt-0.5">Un kit agrupa varias órdenes</div>
          </div>
          <button onClick={handleClose} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
            Nombre del kit <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={nombre}
            onChange={e => { setNombre(e.target.value); if (touched) setTouched(false); }}
            onBlur={() => setTouched(true)}
            placeholder="Ej. Juego completo, Portero…"
            maxLength={60}
            className={`field-input ${hasError ? 'border-red-400 focus:border-red-500 bg-red-50' : ''}`}
          />
          {hasError && (
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              El nombre del kit no puede estar vacío.
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 px-5 pb-5">
          <button onClick={handleClose} className="px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50">Cancelar</button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium bg-[#050314] text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Crear kit
          </button>
        </div>
      </div>
    </div>
  );
}
