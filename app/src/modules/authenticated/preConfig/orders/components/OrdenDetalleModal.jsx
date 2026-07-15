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
  const totalPiezas = (o.clothes || []).reduce((s, c) => s + (c.conf.tot || 0), 0);
  const tiposDisponibles = Array.from(new Set((o.clothes || []).map((c) => c.name)));
  const displayId = o.id;

  function handlePrendasChange(nuevasClothes) {
    onGuardarPrendasOrden(o.id, nuevasClothes);
  }

  return (
    <div
      className="modal-overlay visible"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-box bg-white border border-gray-200 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <div className="text-base font-bold text-gray-900">{displayId}</div>
            <div className="code-box mt-1.5 text-xs py-1.5 px-3" style={{ display: 'inline-block' }}>{o.code || '—'}</div>
          </div>
          <button onClick={onClose} aria-label="Cerrar orden" className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg ml-4 flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 flex-shrink-0 overflow-x-auto">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`flex-1 min-w-fit px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === i ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* General */}
          {activeTab === 0 && (
            <div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-5">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Estado</div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${stCls}`}>{displayStatus(o.status)}</span>
                </div>
                {o.tipoDiseno && (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Tipo de diseño</div>
                    <div className="text-sm font-medium text-gray-900">{o.tipoDiseno}</div>
                  </div>
                )}
                {o.disciplina && (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Disciplina</div>
                    <div className="text-sm font-medium text-gray-900">{o.disciplina}</div>
                  </div>
                )}
                {o.categoria && (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Calidad</div>
                    <div className="text-sm font-medium text-gray-900">{o.categoria}</div>
                  </div>
                )}
                {o.tipoSolicitud && (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Tipo de solicitud</div>
                    <div className="text-sm font-medium text-gray-900">{o.tipoSolicitud}</div>
                  </div>
                )}
              </div>
              {o.observaciones && (
                <div className="mb-5">
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Observaciones</div>
                  <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{o.observaciones}</div>
                </div>
              )}
              <div className="border-t border-gray-100 mb-4"></div>
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Archivos adjuntos</div>
              {adjuntos.length === 0 ? (
                <div className="text-sm text-gray-400 text-center py-4">Sin archivos adjuntos</div>
              ) : (
                <div className="adjunto-grid">
                  {adjuntos.map((a, i) => (
                    <AdjuntoItem key={a.id || i} adjunto={a} index={i} scope="orden-existente" onQuitar={() => {}} readonly />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Prendas */}
          {activeTab === 1 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">Prendas y cantidades</div>
                <div className="flex items-center gap-2">
                  {totalPiezas > 0 && (
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">{totalPiezas} piezas</span>
                  )}
                  {editandoPrendas ? (
                    <button
                      onClick={() => setEditandoPrendas(false)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" /> Guardar
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditandoPrendas(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Editar
                    </button>
                  )}
                </div>
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

          {/* Áreas */}
          {activeTab === 2 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-4">Áreas y actividades</div>
              {areas.length === 0 ? (
                <div className="text-sm text-gray-400">Sin áreas configuradas</div>
              ) : areas.map((a, ai) => {
                const color = AREA_COLORS[a.area] || '#6b7280';
                return (
                  <div key={ai} className="mb-3 rounded-xl border border-gray-100 overflow-hidden">
                    <div
                      className="flex items-center gap-2.5 px-4 py-3"
                      style={{ borderLeft: `4px solid ${color}`, background: `${color}14` }}
                    >
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }}></div>
                      <div className="text-sm font-semibold text-gray-800">{a.area}</div>
                    </div>
                    <div className="px-4 py-3 space-y-2">
                      {(a.actividades || []).length === 0 ? (
                        <div className="text-xs text-gray-400">Sin actividades</div>
                      ) : (a.actividades || []).map((act, li) => (
                        <div key={li} className="flex flex-wrap items-center gap-1.5">
                          <span className="text-xs font-medium text-gray-600">{act.actividad}:</span>
                          {(act.tags || []).length > 0
                            ? (act.tags || []).map((t, ti) => (
                              <span key={ti} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">{t.opcion}</span>
                            ))
                            : <span className="text-xs text-gray-300">Sin opciones</span>
                          }
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Secuencia */}
          {activeTab === 3 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-5">Flujo de producción</div>
              {areas.length === 0 ? (
                <div className="text-sm text-gray-400">Sin secuencia configurada</div>
              ) : (
                <div>
                  {areas.map((a, i) => {
                    const color = AREA_COLORS[a.area] || '#6b7280';
                    const isLast = i === areas.length - 1;
                    return (
                      <div key={i} className="flex items-start gap-4">
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm"
                            style={{ background: color }}
                          >
                            {i + 1}
                          </div>
                          {!isLast && (
                            <div className="w-0.5 flex-1 min-h-[2rem] mt-1 mb-1" style={{ background: `${color}50` }}></div>
                          )}
                        </div>
                        <div
                          className={`flex-1 rounded-xl border border-gray-100 px-4 py-3 ${isLast ? 'mb-0' : 'mb-2'}`}
                          style={{ borderLeft: `3px solid ${color}` }}
                        >
                          <div className="text-sm font-semibold text-gray-800">{a.area}</div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            {(a.actividades || []).length} actividad{(a.actividades || []).length !== 1 ? 'es' : ''}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Resumen */}
          {activeTab === 4 && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">General</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-400">Estado</div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${stCls}`}>{displayStatus(o.status)}</span>
                  </div>
                  {([
                    ['Diseño', o.tipoDiseno],
                    ['Disciplina', o.disciplina],
                    ['Calidad', o.categoria],
                    ['Solicitud', o.tipoSolicitud],
                  ]).filter(([, v]) => v).map(([k, v]) => (
                    <div key={k}>
                      <div className="text-xs text-gray-400">{k}</div>
                      <div className="text-sm font-medium text-gray-800">{v}</div>
                    </div>
                  ))}
                </div>
                {o.observaciones && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-400">Observaciones</div>
                    <div className="text-sm text-gray-700 mt-0.5">{o.observaciones}</div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">Prendas</div>
                  {totalPiezas > 0 && <span className="text-xs font-bold text-green-600">{totalPiezas} piezas</span>}
                </div>
                {!o.clothes?.length ? (
                  <div className="text-sm text-gray-400">Sin prendas</div>
                ) : (() => {
                  const grupos = { hombre: [], mujer: [], niño: [] };
                  (o.clothes || []).forEach((c) => { if (grupos[c.conf.type]) grupos[c.conf.type].push(c); });
                  return Object.entries({ Hombre: 'hombre', Mujer: 'mujer', Niño: 'niño' }).map(([label, key]) => {
                    const items = grupos[key];
                    if (!items.length) return null;
                    return (
                      <div key={key} className="mb-4 last:mb-0">
                        <div className="cloth-group-title text-center mb-2">{label}</div>
                        <div className="cloth-resumen-grid flex flex-wrap justify-center gap-4">
                          {items.map((c) => (
                            <div key={c.id} className="cloth-resumen-card">
                              <div className="cloth-resumen-qty">{c.conf.tot}</div>
                              <div className="cloth-resumen-detail text-center">
                                <div className="cloth-resumen-name">{c.name}</div>
                                <div className="cloth-resumen-talla">T. {c.conf.size}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Flujo de producción</div>
                {areas.length === 0 ? (
                  <div className="text-sm text-gray-400">Sin áreas</div>
                ) : (
                  <div className="flex flex-wrap gap-2 items-center">
                    {areas.map((a, i) => {
                      const color = AREA_COLORS[a.area] || '#6b7280';
                      return (
                        <div key={i} className="flex items-center gap-1.5">
                          <div
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                            style={{ background: color }}
                          >
                            <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: 'rgba(255,255,255,0.25)' }}>
                              {i + 1}
                            </span>
                            {a.area}
                          </div>
                          {i < areas.length - 1 && <ArrowRight className="w-3 h-3 text-gray-300 flex-shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end px-6 py-3 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50">Cerrar</button>
        </div>
      </div>
    </div>
  );
}
