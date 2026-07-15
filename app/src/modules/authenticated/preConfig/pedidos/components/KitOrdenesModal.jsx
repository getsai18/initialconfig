import { useState } from 'react';
import { X, ClipboardList } from 'lucide-react';

export default function KitOrdenesModal({ visible, kitId, pedidoActivo, onClose, onConfirmar }) {
  const [selectedIds, setSelectedIds] = useState([]);

  if (!visible || !kitId || !pedidoActivo) return null;

  const kit = pedidoActivo.kits.find((k) => k.id === kitId);
  const ordenesSueltas = pedidoActivo.ordenes.filter((o) => !kit?.ordenIds.includes(o.id));

  function toggleOrden(id) {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function handleConfirmar() {
    onConfirmar(kitId, selectedIds);
    setSelectedIds([]);
  }

  function handleClose() {
    setSelectedIds([]);
    onClose();
  }

  return (
    <div
      className={`modal-overlay${visible ? ' visible' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="modal-box bg-white border border-gray-200 rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <div className="text-base font-bold text-gray-900">Agregar órdenes al kit</div>
            <div className="text-xs text-gray-400 mt-0.5">{kit?.nombre}</div>
          </div>
          <button onClick={handleClose} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {ordenesSueltas.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <ClipboardList className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <div className="text-sm">No hay órdenes sueltas disponibles.</div>
              <div className="text-xs mt-1">Crea una nueva orden desde el botón "+ Nueva orden" del kit.</div>
            </div>
          ) : (
            ordenesSueltas.map((o) => {
              const tp = o.clothes.reduce((s, c) => s + (c.conf.tot || 0), 0);
              const isChecked = selectedIds.includes(o.id);
              return (
                <label
                  key={o.id}
                  className={`modal-actividad-item cursor-pointer ${isChecked ? 'border-[#050314] bg-[#f0f0ff]' : ''}`}
                  onClick={() => toggleOrden(o.id)}
                >
                  <input type="checkbox" checked={isChecked} onChange={() => toggleOrden(o.id)} className="w-4 h-4 accent-[#050314]" />
                  <div className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-gray-900">{o.id}</span>
                    <span className="block text-xs text-gray-400 font-mono mt-0.5">{o.code}</span>
                  </div>
                  <div className="text-xs text-gray-400">{tp} pzas</div>
                </label>
              );
            })
          )}
        </div>
        <div className="flex items-center justify-between gap-2 px-5 py-4 border-t border-gray-100 flex-shrink-0">
          <span className="text-xs text-gray-400">
            {selectedIds.length > 0 ? `${selectedIds.length} orden${selectedIds.length !== 1 ? 'es' : ''} seleccionada${selectedIds.length !== 1 ? 's' : ''}` : 'Ninguna seleccionada'}
          </span>
          <div className="flex gap-2">
            <button onClick={handleClose} className="px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button
              onClick={handleConfirmar}
              disabled={selectedIds.length === 0}
              title={selectedIds.length === 0 ? 'Selecciona al menos una orden' : ''}
              className="px-4 py-2 text-sm font-medium bg-[#050314] text-white rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Agregar seleccionadas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
