import { useState } from 'react';
import { FileText, File, Trash2 } from 'lucide-react';
import { adjuntoExtInfo } from '../../utils/helpers';

export default function AdjuntoItem({ adjunto: a, index: i, scope, onQuitar, readonly }) {
  const [confirming, setConfirming] = useState(false);
  const info = adjuntoExtInfo(a.type, a.nombre);
  const size = a.size ? ` · ${(a.size / 1024).toFixed(0)} KB` : '';
  const colorText = info.colorCls?.split(' ')[1] || 'text-muted-foreground';
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
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-card/95 backdrop-blur-[2px] rounded-lg border border-destructive/20 shadow-sm z-20 p-2">
      <span className="text-xs text-foreground font-semibold text-center">¿Quitar archivo?</span>
      <div className="flex gap-2">
        <button
          onClick={handleConfirmDelete}
          className="text-xs font-bold text-white bg-destructive px-3 py-1 rounded-lg hover:opacity-90 transition-all shadow-sm"
        >
          Sí
        </button>
        <button
          onClick={handleCancelDelete}
          className="text-xs font-bold text-foreground bg-muted border border-border px-3 py-1 rounded-lg hover:bg-accent transition-all shadow-sm"
        >
          No
        </button>
      </div>
    </div>
  );

  const deleteBtn = !readonly && (
    <button
      onClick={handleDeleteClick}
      className="text-muted-foreground hover:text-destructive p-0.5 rounded transition-colors"
      title="Eliminar adjunto"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );

  return (
    <div className="relative flex flex-col border border-border rounded-lg overflow-hidden bg-card text-card-foreground">
      {confirmOverlay}
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-2 bg-muted/20 border-b border-border min-h-[80px]">
        <div className={`w-10 h-10 rounded-lg border border-border flex items-center justify-center ${info.colorCls || 'bg-muted text-muted-foreground'}`}>
          <IconComp className="w-5 h-5" />
        </div>
        <span className={`text-xs font-bold tracking-wide ${colorText}`}>{info.extLabel || 'DOC'}</span>
      </div>
      <div className="p-2 flex items-center justify-between gap-1 text-xs">
        <div className="truncate font-medium text-foreground" title={a.nombre}>{a.nombre}{size}</div>
        {deleteBtn}
      </div>
    </div>
  );
}
