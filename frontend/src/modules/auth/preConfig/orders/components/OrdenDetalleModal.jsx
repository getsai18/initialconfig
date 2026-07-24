import { useState, useEffect } from 'react';
import { X, ArrowRight, Pencil, Check } from 'lucide-react';
import AdjuntoItem from './AdjuntoItem';
import PrendasEditor from '../pages/PrendasEditor';
import { displayStatus, statusBadgeCls } from '../../utils/helpers';

const AREA_COLORS = {
  'Corte': '#eab308',
  'Costura': '#10b981',
  'Sublimación': '#ec4899',
  'Control de Calidad': '#6b7280',
  'Empaque y Envío': '#3b82f6',
  'Bordado': '#8b5cf6',
};

const TABS = ['General', 'Prendas', 'Áreas', 'Secuencia', 'Resumen'];

export default function OrdenDetalleModal({ visible, ordenId, pedidoActivo, onClose, onGuardarPrendasOrden }) {
  const [activeTab, setActiveTab] = useState(0);
  const o = pedidoActivo?.ordenes?.find((ord) => ord.id === ordenId);
  const [editandoPrendas, setEditandoPrendas] = useState(false);

  useEffect(() => {
    if (visible) {
      setActiveTab(0);
      setEditandoPrendas(false);
    }
  }, [ordenId, visible]);

  if (!visible || !ordenId || !pedidoActivo || !o) return null;

  const stCls = statusBadgeCls(o.status);
  const areas = o.config?.areas || [];

  const adjuntos = o.adjuntos !== undefined ? o.adjuntos : (pedidoActivo?.adjuntos || []);
  const totalPiezas = (o.clothes || []).reduce((s, c) => s + (c.conf?.tot || 0), 0);
  const tiposDisponibles = Array.from(new Set((o.clothes || []).map((c) => c.name)));
  const displayId = o.id;

  function handlePrendasChange(nuevasClothes) {
    onGuardarPrendasOrden(o.id, nuevasClothes);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl p-6">
        <div className="flex items-start justify-between pb-4 border-b border-border flex-shrink-0">
          <div>
            <div className="text-base font-bold text-foreground">{displayId}</div>
            <div className="font-mono text-xs px-2 py-1 bg-muted rounded text-muted-foreground mt-1 inline-block">{o.code || '—'}</div>
          </div>
          <button onClick={onClose} aria-label="Cerrar orden" className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-border flex-shrink-0 overflow-x-auto my-2">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === i ? 'border-primary text-primary font-bold' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {activeTab === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">Estado</div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${stCls}`}>{displayStatus(o.status)}</span>
                </div>
                {o.tipoDiseno && (
                  <div>
                    <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">Tipo de diseño</div>
                    <div className="font-medium text-foreground">{o.tipoDiseno}</div>
                  </div>
                )}
                {o.disciplina && (
                  <div>
                    <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">Disciplina</div>
                    <div className="font-medium text-foreground">{o.disciplina}</div>
                  </div>
                )}
                {o.categoria && (
                  <div>
                    <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">Calidad</div>
                    <div className="font-medium text-foreground">{o.categoria}</div>
                  </div>
                )}
              </div>
              {o.observaciones && (
                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">Observaciones</div>
                  <div className="text-sm text-foreground bg-muted/30 rounded-lg p-3 border border-border">{o.observaciones}</div>
                </div>
              )}
            </div>
          )}

          {activeTab === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase text-muted-foreground">Prendas y cantidades</div>
                {totalPiezas > 0 && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">{totalPiezas} piezas</span>
                )}
              </div>
              <PrendasEditor
                clothesData={o.clothes || []}
                onChange={handlePrendasChange}
                tiposDisponibles={tiposDisponibles}
                readonly={!editandoPrendas}
                minItems={1}
              />
            </div>
          )}

          {activeTab === 2 && (
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">Áreas y actividades</div>
              {areas.length === 0 ? (
                <div className="text-sm text-muted-foreground">Sin áreas configuradas</div>
              ) : areas.map((a, ai) => {
                const color = AREA_COLORS[a.area] || '#6b7280';
                return (
                  <div key={ai} className="p-3 border border-border rounded-xl bg-card">
                    <div className="font-semibold text-foreground text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: color }}></span>
                      {a.area}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 3 && (
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase text-muted-foreground mb-3">Flujo de producción</div>
              {areas.map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-3 border border-border rounded-lg bg-card text-sm">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">{i + 1}</span>
                  <span className="font-semibold text-foreground">{a.area}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 4 && (
            <div className="space-y-4 text-sm">
              <div className="p-4 border border-border rounded-xl bg-card">
                <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">Resumen General</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-muted-foreground block">Código</span>
                    <span className="font-mono text-primary font-bold">{o.code}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Total Piezas</span>
                    <span className="font-bold text-foreground">{totalPiezas} pzas</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-border flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-accent">Cerrar</button>
        </div>
      </div>
    </div>
  );
}
