import { useState } from 'react';
import { FileText, File, Trash2 } from 'lucide-react';
import { adjuntoExtInfo } from '../utils/helpers';



export default function AdjuntoItem({ adjunto: a, index: i, scope, onQuitar, readonly }) {
  const [confirming, setConfirming] = useState(false);
  const info = adjuntoExtInfo(a.type, a.nombre);
  const size = a.size ? ` · ${(a.size / 1024).toFixed(0)} KB` : '';
  const colorText = info.colorCls.split(' ')[1] || 'text-gray-500';
  const IconComp = info.iconName === 'file-text' ? FileText : File;

  function handleDeleteClick(e) {
    e.stopPropagation();
    setConfirming(true);
  }
  function handleConfirmDelete(e) {
    e.stopPropagation();
    onQuitar(i, scope);
    setConfirming(false);
  }
  function handleCancelDelete(e) {
    e.stopPropagation();
    setConfirming(false);
  }

  const confirmOverlay = !readonly && confirming && (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/95 backdrop-blur-[2px] rounded-lg border border-red-200 shadow-sm z-20">
      <span className="text-xs text-gray-700 font-semibold px-2 text-center">¿Quitar archivo?</span>
      <div className="flex gap-2">
        <button
          onClick={handleConfirmDelete}
          className="text-xs font-bold text-white bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600 active:scale-95 transition-all shadow-sm"
        >
          Sí
        </button>
        <button
          onClick={handleCancelDelete}
          className="text-xs font-bold text-gray-700 bg-gray-100 border border-gray-200 px-3 py-1 rounded-lg hover:bg-gray-200 active:scale-95 transition-all shadow-sm"
        >
          No
        </button>
      </div>
    </div>
  );

  const deleteBtn = !readonly && (
    <button
      onClick={handleDeleteClick}
      className="text-gray-400 hover:text-red-500 p-0.5 rounded transition-colors"
      title="Eliminar adjunto"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );

  if (info.isImg) {
    return (
      <div className="adjunto-preview-card relative">
        {confirmOverlay}
        <img className="adjunto-preview-img" src={a.dataUrl} alt={a.nombre} />
        <div className="adjunto-preview-footer">
          <div className="adjunto-preview-name" title={a.nombre}>{a.nombre}</div>
          {deleteBtn}
        </div>
      </div>
    );
  }

  return (
    <div className="adjunto-preview-card relative flex flex-col">
      {confirmOverlay}
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-2 bg-gray-50 border-b border-gray-100 min-h-[80px]">
        <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${info.colorCls}`}>
          <IconComp className="w-5 h-5" />
        </div>
        <span className={`text-xs font-bold tracking-wide ${colorText}`}>{info.extLabel}</span>
      </div>
      <div className="adjunto-preview-footer">
        <div className="adjunto-preview-name" title={a.nombre}>{a.nombre}{size}</div>
        {deleteBtn}
      </div>
    </div>
  );
}
