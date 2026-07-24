import { useState, useEffect, useMemo, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, ChevronDown,
  ClipboardList, Shirt, Image, Pencil, Upload,
  Plus, Info, TriangleAlert, CheckCircle,
  GripVertical, ArrowDownUp, AlertCircle, X, Search,
  Box, Package
} from 'lucide-react';

const Pants = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 3h14v7l-3 7v4H8v-4l-3-7V3z" />
    <path d="M12 3v14" />
  </svg>
);

import AdjuntoItem from '../components/AdjuntoItem';
import PrendasEditor from './PrendasEditor';
import { prendasCatalogo as prendasDefault } from '../../data/catalogos';
import { generarCodigo, tipoSolicitudLimpio } from '../../utils/helpers';
import PrendasService from '@/modules/auth/initialConfig/prendas/services/PrendasService';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'pdf', 'txt', 'doc', 'docx'];

function renderIconoPrenda(emoji) {
  switch (emoji) {
    case '👕': return <Shirt className="w-6 h-6" />;
    case '🩳': return <Pants className="w-6 h-6" />;
    case '🎒': return <Box className="w-6 h-6" />;
    case '📦': return <Package className="w-6 h-6" />;
    default: return <Shirt className="w-6 h-6" />;
  }
}

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600">
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {msg}
    </div>
  );
}

function CharCounter({ current, max }) {
  const near = current >= max * 0.85;
  const over = current >= max;
  if (!near) return null;
  return (
    <span className={`text-[11px] ml-1 ${over ? 'text-red-600 font-semibold' : 'text-amber-600'}`}>
      {current}/{max}
    </span>
  );
}

function StepBar({ substepActual, onGoSubstepNav }) {
  const steps = [
    { n: 1, label: 'General' },
    { n: 2, label: 'Prendas' },
    { n: 3, label: 'Áreas' },
    { n: 4, label: 'Secuencia' },
    { n: 5, label: 'Resumen' },
  ];
  return (
    <div className="flex items-center my-6 flex-wrap gap-2">
      {steps.map((s, idx) => {
        const isDone = s.n < substepActual;
        const isActive = s.n === substepActual;
        return (
          <div key={s.n} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onGoSubstepNav(s.n)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#050314] text-white shadow-sm'
                  : isDone
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-gray-100 text-gray-400 hover:text-gray-600'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                  isActive
                    ? 'bg-white text-[#050314]'
                    : isDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-400 border border-gray-200'
                }`}
              >
                {isDone ? '✓' : s.n}
              </div>
              <span>{s.label}</span>
            </button>
            {idx < steps.length - 1 && (
              <div className={`h-0.5 w-6 sm:w-10 ${isDone ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ActividadOpciones({ act, areaIdx, actIdx, onSelectTagOp, onToggleMulti, onTextChange, onCustomOtroToggle, onCustomOtroChange }) {
  if (act.tipo === 'texto') {
    return (
      <textarea
        className="w-full min-h-16 p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 resize-y outline-none focus:border-gray-400 font-sans mt-1"
        placeholder="Escribe aquí…"
        value={act.selectedOptions?.[0] || ''}
        onChange={e => onTextChange(areaIdx, actIdx, e.target.value)}
      />
    );
  }
  const multi = act.tipo === 'checkbox';
  
  return (
    <div className="tag-group">
      {act.opciones.map((op) => {
        let isCustom = false;
        let displayOp = op;
        let savePrefix = op;

        if (typeof op === 'string') {
          if (op.startsWith('__otro__:')) {
            isCustom = true;
            displayOp = op.substring(9);
            savePrefix = `${displayOp}: `;
          } else if (op === '__otro__') {
            isCustom = true;
            displayOp = 'Otro';
            savePrefix = 'Otro: ';
          } else if (op.endsWith(':')) {
            isCustom = true;
            displayOp = op.slice(0, -1);
            savePrefix = `${displayOp}: `;
          }
        }
        
        const opts = act.selectedOptions || [];
        const isSel = isCustom 
          ? opts.some((o) => o.startsWith(savePrefix.trim()) || o === '__otro__') 
          : opts.includes(op);

        const customVal = (isSel && isCustom) 
          ? (opts.find((o) => o.startsWith(savePrefix.trim())) || '').substring(savePrefix.length) 
          : '';

        return (
          <div key={typeof op === 'string' ? op : op.etiqueta} className="flex items-center gap-2 flex-wrap mt-1">
            <button
              type="button"
              className={`tag-option ${multi ? 'multi' : ''} ${isSel ? 'selected' : ''}`}
              onClick={() => {
                const valueToSave = isCustom ? savePrefix : op;
                if (multi) onToggleMulti(areaIdx, actIdx, valueToSave);
                else onSelectTagOp(areaIdx, actIdx, valueToSave);
              }}
            >
              {displayOp}
            </button>
            {isSel && isCustom && (
              <input
                type="text"
                placeholder="Especificar..."
                value={customVal}
                onChange={e => onCustomOtroChange(areaIdx, actIdx, savePrefix, e.target.value, multi)}
                className="px-2.5 py-1 text-xs border border-gray-300 rounded-md outline-none focus:border-gray-500 bg-white min-w-[150px] flex-1 max-w-[250px]"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ResumenView({
  disciplina, categoria, tipoSolicitud, observaciones, tipoDiseno,
  prendasSeleccionadas, clothesData, adjuntosData, areasActivas, areasSecuencia, pedidoActivo
}) {
  const totalPiezas = clothesData.reduce((s, c) => s + (c.conf?.tot || 0), 0);
  const tipoSolDisplay = tipoSolicitudLimpio(tipoSolicitud);
  const areasActuales = areasActivas || [];

  const grupos = { hombre: [], mujer: [], niño: [] };
  clothesData.forEach((c) => {
    if (grupos[c.conf?.type]) grupos[c.conf.type].push(c);
  });

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3 pb-2.5 border-b border-gray-100">Información General</div>
        <div className="resumen-grid">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Tipo de diseño</div>
            <div className="text-sm font-semibold text-gray-900">{tipoDiseno}</div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Disciplina</div>
            <div className="text-sm font-semibold text-gray-900">{disciplina || '—'}</div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Calidad de producto</div>
            <div className="text-sm font-semibold text-gray-900">{categoria || '—'}</div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Tipo de solicitud</div>
            <div className="text-sm font-semibold text-gray-900">
              {tipoSolDisplay !== '—' ? tipoSolDisplay : <span className="text-gray-400">Sin especificar</span>}
            </div>
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Prendas seleccionadas</div>
            <div className="text-sm text-gray-700">{prendasSeleccionadas.join(', ')}</div>
          </div>
        </div>
        {observaciones && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Observaciones</div>
            <div className="text-sm text-gray-600">{observaciones}</div>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3 pb-2.5 border-b border-gray-100">
          Prendas y cantidades · <span className="text-green-600 font-bold">{totalPiezas} piezas total</span>
        </div>
        {clothesData.length === 0 ? (
          <div className="text-sm text-gray-400">Sin prendas capturadas</div>
        ) : Object.entries({ Hombre: 'hombre', Mujer: 'mujer', Niño: 'niño' }).map(([label, key]) => {
          const items = grupos[key];
          if (!items.length) return null;
          return (
            <div key={key} className="mb-4">
              <div className="cloth-group-title text-center mb-2">{label}</div>
              <div className="cloth-resumen-grid flex flex-wrap justify-center gap-4">
                {items.map((c) => (
                  <div key={c.id} className="cloth-resumen-card">
                    <div className="cloth-resumen-qty">{c.conf?.tot || 0}</div>
                    <div className="cloth-resumen-detail text-center">
                      <div className="cloth-resumen-name">{c.name}</div>
                      <div className="cloth-resumen-talla text-gray-500 text-xs">
                        {c.conf?.size || c.conf?.talla || c.talla || 'Sin talla'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3 pb-2.5 border-b border-gray-100">Flujo de producción</div>
        {(() => {
          const areasOrdenadas = areasSecuencia && areasSecuencia.length > 0
            ? areasSecuencia.map((n) => areasActuales.find((a) => a.nombre === n)).filter((a) => a && a.activa && a.actividades?.length > 0)
            : areasActuales.filter((a) => a.activa && a.actividades?.length > 0);
          if (areasOrdenadas.length === 0) return <div className="text-sm text-gray-400">Sin áreas activas</div>;
          return areasOrdenadas.map((area, seqIdx) => (
            <div key={area.nombre}>
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ backgroundColor: (area.color || '#6b7280') + '20', color: area.color || '#6b7280', border: `1.5px solid ${area.color || '#6b7280'}` }}>{seqIdx + 1}</div>
                  <div className="text-xs font-semibold" style={{ color: area.color || '#6b7280' }}>{area.nombre}</div>
                </div>
                {(area.actividades || []).map((act, ai) => {
                  const opts = act.selectedOptions || [];
                  if (!opts.length) return null;
                  return (
                    <div key={ai} className="mb-1.5 text-xs ml-7">
                      <span className="text-gray-400">{act.nombre}: </span>
                      {act.tipo === 'texto' ? <span className="text-gray-700 italic">{opts[0]}</span> : (
                        <span className="flex flex-wrap gap-1 mt-1 inline-flex">
                          {opts.map((op) => <span key={op} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">{op}</span>)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              {seqIdx < areasOrdenadas.length - 1 && (
                <div className="flex flex-col items-center my-0.5 ml-2.5">
                  <div className="w-0.5 h-3 bg-gray-200"></div>
                  <ChevronDown className="w-3 h-3 text-gray-300" />
                </div>
              )}
            </div>
          ));
        })()}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3 pb-2.5 border-b border-gray-100">Archivos adjuntos</div>
        <div className="flex flex-wrap gap-2">
          {adjuntosData.length === 0
            ? <span className="text-xs text-gray-400">Sin adjuntos</span>
            : adjuntosData.map((a) => <span key={a.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">📎 {a.nombre}</span>)
          }
        </div>
      </div>

      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-700 mb-4">
        <TriangleAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div className="text-xs leading-relaxed">Revisa toda la información antes de confirmar. Una vez confirmada, la orden quedará con estado En progreso en el pedido.</div>
      </div>
    </div>
  );
}

function AreasFormMobile({
  areasActivas,
  onToggleArea,
  onQuitarActividad,
  onAbrirModalActividades,
  onSelectTagOp,
  onToggleMulti,
  onTextChange,
  onViewChange,
  onCustomOtroToggle,
  onCustomOtroChange,
  tpuAlert
}) {
  const [mobileView, setMobileView] = useState('list');
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [showPicker, setShowPicker] = useState(false);
  const [mobileAlert, setMobileAlert] = useState(null);
  const [filtro, setFiltro] = useState('');

  const areas = areasActivas || [];
  const activeAreas = areas.filter((a) => a.activa);
  const inactiveAreas = areas.filter((a) => !a.activa);
  const selectedArea = selectedIdx !== null ? areas[selectedIdx] : null;

  const filteredInactiveAreas = inactiveAreas.filter((area) =>
    area.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  function switchView(v) {
    setMobileView(v);
    onViewChange?.(v);
  }

  function addArea(idx) {
    onToggleArea(idx, true);
    setShowPicker(false);
    setSelectedIdx(idx);
    setIsCreating(true);
    setExpanded({});
    setFiltro('');
    switchView('panel');
  }

  function editArea(idx) {
    setSelectedIdx(idx);
    setIsCreating(false);
    setExpanded({});
    switchView('panel');
  }

  function deactivateArea(idx) {
    onToggleArea(idx, false);
    const acts = (areas[idx]?.actividades || []);
    for (let i = acts.length - 1; i >= 0; i--) {
      onQuitarActividad(idx, i);
    }
  }

  function cancelCreate() {
    if (selectedIdx !== null) deactivateArea(selectedIdx);
    backToList();
  }

  function cancelEdit() {
    backToList();
  }

  function confirmPanel() {
    if (!selectedArea) return;
    const acts = selectedArea.actividades || [];
    if (acts.length === 0) {
      setMobileAlert({ title: 'Área sin actividades', msg: 'Debes agregar al menos una actividad antes de confirmar el área.' });
      return;
    }
    const allDone = acts.every((a) => (a.selectedOptions || []).length > 0);
    if (!allDone) {
      setMobileAlert({ title: 'Actividades incompletas', msg: 'Completa todas las actividades antes de guardar.' });
      return;
    }
    backToList();
  }

  function backToList() {
    setSelectedIdx(null);
    setIsCreating(false);
    setExpanded({});
    switchView('list');
  }

  function toggleExpand(key) {
    setExpanded(prev => (prev[key] ? {} : { [key]: true }));
  }

  const AlertOverlay = mobileAlert ? (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-6">
      <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-xs">
        <div className="w-11 h-11 rounded-full bg-amber-100 flex items-center justify-center text-xl mb-4">⚠️</div>
        <div className="text-base font-extrabold text-gray-900 mb-1.5">{mobileAlert.title}</div>
        <div className="text-xs text-gray-500 leading-relaxed mb-5">{mobileAlert.msg}</div>
        <button
          onClick={() => setMobileAlert(null)}
          className="w-full py-3 bg-[#050314] text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  ) : null;

  if (mobileView === 'list') {
    return (
      <div>
        {inactiveAreas.length > 0 && (
          <button
            onClick={() => setShowPicker(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-[#050314] text-white rounded-2xl text-sm font-bold mb-3 hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar área de producción
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {activeAreas.length === 0 && (
          <div className="text-center py-10 px-4 border-2 border-dashed border-gray-200 rounded-2xl mb-3 bg-gray-50">
            <div className="text-4xl mb-2">🏭</div>
            <div className="text-sm font-bold text-gray-700 mb-1">Aún no hay áreas seleccionadas</div>
            <div className="text-xs text-gray-400 leading-relaxed">
              Toca <strong>"Agregar área de producción"</strong> para seleccionar las áreas que participarán en esta orden
            </div>
          </div>
        )}

        {activeAreas.map((area) => {
          const idx = areas.indexOf(area);
          return (
            <div
              key={area.nombre}
              className="bg-white border border-gray-200 rounded-2xl mb-2 overflow-hidden"
              style={{ borderLeftWidth: 3, borderLeftColor: area.color || '#6b7280' }}
            >
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: area.color || '#6b7280' }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-gray-900 truncate">{area.nombre}</div>
                  {area.actividades?.length > 0 && (
                    <div className="text-xs text-gray-400 mt-0.5">{area.actividades.length} actividad{area.actividades.length !== 1 ? 'es' : ''}</div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => editArea(idx)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                    style={{ background: (area.color || '#6b7280') + '18', color: area.color || '#6b7280' }}
                  >
                    {(area.actividades?.length || 0) > 0 ? 'Ver y editar' : 'Configurar'}
                    <ChevronRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => deactivateArea(idx)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {showPicker && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-6">
            <div className="absolute inset-0 bg-black/45 transition-opacity" onClick={() => setShowPicker(false)} />
            <div className="relative w-full md:max-w-md bg-white rounded-t-3xl md:rounded-2xl shadow-2xl flex flex-col h-[80vh] overflow-hidden pb-6 md:pb-0">
              <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
                <div className="text-xs font-bold text-gray-500">Selecciona un área para agregar:</div>
                <button onClick={() => { setShowPicker(false); setFiltro(''); }} className="text-gray-400 hover:text-gray-700 bg-gray-50 p-1.5 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-5 py-2.5 border-b border-gray-100 flex-shrink-0 bg-gray-50/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar área…"
                    value={filtro}
                    onChange={e => setFiltro(e.target.value)}
                    className="pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-400 w-full"
                  />
                </div>
              </div>

              <div className="overflow-y-auto flex-1">
                {inactiveAreas.length === 0 ? (
                  <div className="px-5 py-8 text-sm text-gray-400 text-center">Todas las áreas ya están agregadas.</div>
                ) : filteredInactiveAreas.map((area) => {
                  const idx = areas.indexOf(area);
                  return (
                    <button
                      key={area.nombre}
                      onClick={() => addArea(idx)}
                      className="w-full flex items-center gap-3 px-5 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 text-left"
                    >
                      <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ background: area.color || '#6b7280' }} />
                      <span className="flex-1 text-sm font-semibold text-gray-800">{area.nombre}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {AlertOverlay}
      </div>
    );
  }

  if (!selectedArea) return null;
  const areaColor = selectedArea.color || '#6b7280';
  const actividades = selectedArea.actividades || [];
  const allDone = actividades.length > 0 && actividades.every((a) => (a.selectedOptions || []).length > 0);

  return (
    <div>
      <div className="flex items-center gap-2 pb-3 mb-3" style={{ borderBottom: `2px solid ${areaColor}` }}>
        {!isCreating && (
          <button onClick={cancelEdit} className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-200 flex-shrink-0">
            <ChevronLeft className="w-4 h-4" /> Volver
          </button>
        )}
        <div className="flex items-center gap-2 flex-1 justify-center">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: areaColor }} />
          <span className="text-sm font-extrabold text-gray-900">{selectedArea.nombre}</span>
        </div>
      </div>

      {actividades.map((act, li) => {
        const key = `${selectedIdx}-${li}`;
        const isOpen = !!expanded[key];
        const opts = act.selectedOptions || [];
        const isConfigured = opts.length > 0;

        return (
          <div key={key} className={`rounded-2xl mb-2 overflow-hidden border-2 bg-white transition-colors ${isConfigured ? 'border-gray-200' : 'border-amber-300'}`}>
            <button onClick={() => toggleExpand(key)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-gray-900">{act.nombre}</div>
                {!isOpen && (
                  isConfigured ? (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {opts.map((op) => (
                        <span key={op} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-800">
                          {op}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-amber-600 font-medium mt-0.5">⚠ Toca aquí para completar esta actividad</div>
                  )
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                <div className="flex items-start justify-between gap-2 mb-3 pt-3">
                  <p className="text-xs text-gray-500 flex-1 leading-relaxed">
                    {act.tipo === 'radio' ? 'Selection única:' : act.tipo === 'checkbox' ? 'Selección múltiple:' : 'Escribe información:'}
                  </p>
                  <button onClick={() => onQuitarActividad(selectedIdx, li)} className="text-xs font-semibold text-red-500 border border-red-200 rounded-lg px-2.5 py-1 hover:bg-red-50">
                    Quitar
                  </button>
                </div>

                <ActividadOpciones
                  act={act} areaIdx={selectedIdx} actIdx={li}
                  onSelectTagOp={onSelectTagOp} onToggleMulti={onToggleMulti}
                  onTextChange={onTextChange} onCustomOtroToggle={onCustomOtroToggle}
                  onCustomOtroChange={onCustomOtroChange}
                />
              </div>
            )}
          </div>
        );
      })}

      <button onClick={() => onAbrirModalActividades(selectedIdx)} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-[#050314] text-white rounded-2xl text-sm font-bold mb-3 mt-1 hover:bg-gray-800">
        <Plus className="w-4 h-4" /> Agregar actividad a esta área
      </button>

      <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
        <button onClick={isCreating ? cancelCreate : cancelEdit} className="px-4 py-2.5 text-sm font-semibold bg-white border-2 border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50">
          Cancelar
        </button>
        <button onClick={confirmPanel} disabled={!allDone} className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold rounded-xl ${allDone ? 'bg-[#050314] text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
          {isCreating ? 'Agregar área' : 'Guardar'} <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {AlertOverlay}
    </div>
  );
}

export default function NuevaOrdenScreen({
  pedidoActivo, kitDestino,
  esReutilizado, tipoDiseno, setTipoDiseno,
  prendasSeleccionadas, setPrendasSeleccionadas,
  clothesData, setClothesData,
  adjuntosData,
  areasActivas, setAreasActivas,
  areasSecuencia, setAreasSecuencia,
  substepActual, maxSubstep,
  disciplina, setDisciplina,
  categoria, setCategoria,
  tipoSolicitud, setTipoSolicitud,
  observaciones, setObservaciones,
  onSalirNuevaOrden, onConfirmarOrden,
  onAbrirModalActividades,
  onHandleAdjuntos, onQuitarAdjunto,
  onGoSubstep, onGoSubstepNav,
  onShowAlert,
}) {
  const [collapsed, setCollapsed] = useState({});
  const [mobileAreasView, setMobileAreasView] = useState('list');
  const [step1Touched, setStep1Touched] = useState(false);
  const [adjError, setAdjError] = useState('');
  const [catalogLivePrendas, setCatalogLivePrendas] = useState(prendasDefault);

  useEffect(() => {
    PrendasService.getAll()
      .then((res) => {
        const list = Array.isArray(res?.content) ? res.content : Array.isArray(res) ? res : [];
        if (list.length > 0) {
          const mapped = list.map(p => ({
            nombre: p.nombre,
            icono: p.icono || '👕'
          }));
          setCatalogLivePrendas(mapped);
        }
      })
      .catch(console.warn);
  }, []);

  const codePreview = generarCodigo(disciplina, tipoSolicitud, pedidoActivo?.id);

  function toggleSection(id) {
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function togglePrenda(nombre) {
    if (prendasSeleccionadas.includes(nombre)) {
      if (prendasSeleccionadas.length === 1) return;
      const newList = prendasSeleccionadas.filter((p) => p !== nombre);
      setPrendasSeleccionadas(newList);
      setClothesData(clothesData.filter((c) => c.name !== nombre));
    } else {
      const newList = [...prendasSeleccionadas, nombre];
      setPrendasSeleccionadas(newList);
    }
  }

  const step1Errors = {
    disciplina: !disciplina.trim() ? 'Disciplina es requerida' : disciplina.length > 60 ? 'Máximo 60 caracteres' : '',
    categoria: !categoria ? 'Selecciona una calidad de producto' : '',
    tipoSolicitud: !tipoSolicitud.trim() ? 'Tipo de solicitud es requerido' : tipoSolicitud.length > 60 ? 'Máximo 60 caracteres' : '',
    observaciones: observaciones.length > 300 ? 'Máximo 300 caracteres' : '',
  };
  const step1HasErrors = step1Errors.disciplina || step1Errors.categoria || step1Errors.tipoSolicitud || step1Errors.observaciones;

  function handleGoStep2() {
    setStep1Touched(true);
    if (prendasSeleccionadas.length === 0) {
      onShowAlert?.('Prenda requerida', 'Debes seleccionar al menos un tipo de prenda antes de continuar.', 'shirt');
      return;
    }
    if (step1HasErrors) return;
    onGoSubstep(2);
  }

  function onToggleArea(areaIdx, activa) {
    setAreasActivas((prev) => prev.map((a, i) => i === areaIdx ? { ...a, activa } : a));
  }
  function onQuitarActividad(areaIdx, actIdx) {
    setAreasActivas((prev) => prev.map((a, i) =>
      i === areaIdx ? { ...a, actividades: a.actividades.filter((_, li) => li !== actIdx) } : a
    ));
  }
  function onSelectTagOp(areaIdx, actIdx, option) {
    setAreasActivas((prev) => prev.map((a, i) =>
      i !== areaIdx ? a : {
        ...a,
        actividades: a.actividades.map((act, li) =>
          li !== actIdx ? act : { ...act, selectedOptions: [option] }
        )
      }
    ));
  }

  function onToggleMulti(areaIdx, actIdx, option) {
    setAreasActivas((prev) => prev.map((a, i) =>
      i !== areaIdx ? a : {
        ...a,
        actividades: a.actividades.map((act, li) => {
          if (li !== actIdx) return act;
          const opts = act.selectedOptions || [];
          const isCustom = option.includes(':');
          const cleanOption = isCustom ? option.split(':')[0] + ':' : option;
          const isIncluded = isCustom 
            ? opts.some((o) => o.startsWith(cleanOption)) 
            : opts.includes(option);
          
          let newOpts;
          if (isIncluded) {
            newOpts = isCustom 
              ? opts.filter((o) => !o.startsWith(cleanOption)) 
              : opts.filter((o) => o !== option);         
          } else {
            newOpts = [...opts, option];
          }
          return { ...act, selectedOptions: newOpts };
        })
      }
    ));
  }

  function onTextChange(areaIdx, actIdx, value) {
    setAreasActivas((prev) => prev.map((a, i) =>
      i !== areaIdx ? a : {
        ...a,
        actividades: a.actividades.map((act, li) =>
          li !== actIdx ? act : { ...act, selectedOptions: value ? [value] : [] }
        )
      }
    ));
  }

  function onCustomOtroChange(areaIdx, actIdx, baseOp, value, multi) {
    setAreasActivas((prev) => prev.map((a, i) => {
      if (i !== areaIdx) return a;
      return {
        ...a,
        actividades: a.actividades.map((act, li) => {
          if (li !== actIdx) return act;
          const opts = act.selectedOptions || [];
          const newValue = `${baseOp}${value}`;
          if (multi) {
            const hasBase = opts.some((o) => o.startsWith(baseOp));
            if (hasBase) {
              return {
                ...act,
                selectedOptions: opts.map((o) => o.startsWith(baseOp) ? newValue : o)
              };
            } else {
              return { ...act, selectedOptions: [...opts, newValue] };
            }
          } else {
            return { ...act, selectedOptions: [newValue] };
          }
        })
      };
    }));
  }

  function onCustomOtroToggle(areaIdx, actIdx, newOpts) {
    setAreasActivas((prev) => prev.map((a, i) =>
      i !== areaIdx ? a : {
        ...a,
        actividades: a.actividades.map((act, li) =>
          li !== actIdx ? act : { ...act, selectedOptions: newOpts }
        )
      }
    ));
  }

  const kitInfo = pedidoActivo?.kits?.find((k) => k.id === kitDestino);
  const noSubText = kitDestino && kitInfo ? `Nueva orden para el kit "${kitInfo.nombre}"` : 'Completa los datos de producción';

  return (
    <div className="p-6 w-full">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Nueva orden</h1>
          <p className="text-sm text-gray-500 mt-1">{noSubText}</p>
        </div>
        <button onClick={onSalirNuevaOrden} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          <ChevronLeft className="w-4 h-4" /> Volver
        </button>
      </div>

      <StepBar substepActual={substepActual} maxSubstep={maxSubstep} onGoSubstepNav={onGoSubstepNav} />

      {/* STEP 1: GENERAL */}
      {substepActual === 1 && (
        <div>
          <div className={`form-section bg-white border border-gray-200 rounded-xl mb-4${collapsed['general'] ? ' collapsed' : ''}`}>
            <div className="form-section-header flex items-center justify-between px-5 py-3.5 border-b border-gray-100 cursor-pointer hover:bg-gray-50 rounded-t-xl" onClick={() => toggleSection('general')}>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <ClipboardList className="w-4 h-4 text-gray-500" /> Información general
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 chevron-icon" />
            </div>
            <div className="form-section-body p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Tipo de diseño</label>
                  <div className="tag-group flex gap-2">
                    {['Nuevo', 'Pasado', 'Ambos'].map(val => (
                      <button
                        key={val}
                        type="button"
                        className={`tag-option px-3 py-1.5 rounded-lg text-xs font-semibold border ${tipoDiseno === val ? 'bg-[#050314] text-white border-[#050314]' : 'bg-white text-gray-700 border-gray-200'}`}
                        onClick={() => setTipoDiseno(val)}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                    Disciplina <span className="text-red-500">*</span>
                    <CharCounter current={disciplina.length} max={60} />
                  </label>
                  <input
                    type="text"
                    value={disciplina}
                    onChange={e => setDisciplina(e.target.value)}
                    placeholder="Ej. Fútbol, Básquetbol…"
                    maxLength={60}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400"
                  />
                  {step1Touched && <FieldError msg={step1Errors.disciplina} />}
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                    Calidad de producto <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={categoria}
                    onChange={e => setCategoria(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400"
                  >
                    <option value="">Seleccionar…</option>
                    <option>Amateur</option>
                    <option>Semi</option>
                    <option>Profesional</option>
                    <option>Pro Elite</option>
                  </select>
                  {step1Touched && <FieldError msg={step1Errors.categoria} />}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                  Tipo de solicitud <span className="text-red-500">*</span> (forma parte del código de orden)
                </label>
                <input
                  type="text"
                  value={tipoSolicitud}
                  onChange={e => setTipoSolicitud(e.target.value)}
                  placeholder="Ej. JuegoLocal, Entrenamiento, Portero…"
                  maxLength={60}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400"
                />
                {step1Touched && <FieldError msg={step1Errors.tipoSolicitud} />}
              </div>
              <div className="mt-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Código de orden (preview)</div>
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg font-mono text-sm text-blue-700 font-bold">{codePreview}</div>
              </div>
            </div>
          </div>

          <div className="form-section bg-white border border-gray-200 rounded-xl mb-4">
            <div className="form-section-header flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <Shirt className="w-4 h-4 text-gray-500" /> Tipos de prenda
              </div>
            </div>
            <div className="form-section-body p-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {catalogLivePrendas.map((p) => {
                  const isSel = prendasSeleccionadas.includes(p.nombre);
                  return (
                    <div
                      key={p.nombre}
                      onClick={() => togglePrenda(p.nombre)}
                      className={`p-3 border rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${isSel ? 'border-[#050314] bg-gray-50 text-[#050314] font-bold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      <div className="mb-1">{renderIconoPrenda(p.icono)}</div>
                      <span className="text-xs text-center">{p.nombre}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="form-section bg-white border border-gray-200 rounded-xl mb-4">
            <div className="form-section-header flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <Pencil className="w-4 h-4 text-gray-500" /> Observaciones generales
              </div>
            </div>
            <div className="form-section-body p-5">
              <textarea
                value={observaciones}
                onChange={e => setObservaciones(e.target.value)}
                maxLength={300}
                placeholder="Notas especiales, indicaciones para el equipo de producción…"
                className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-gray-400"
                rows={3}
              />
              <div className="text-xs text-gray-400 mt-1">{observaciones.length}/300 caracteres</div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGoStep2}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#050314] text-white rounded-lg hover:bg-gray-800"
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PRENDAS */}
      {substepActual === 2 && (
        <div>
          <div className="bg-white border border-gray-200 rounded-xl mb-4 p-5">
            <h2 className="text-base font-bold text-gray-900 mb-4">Prendas y cantidades</h2>
            <PrendasEditor
              clothesData={clothesData}
              onChange={setClothesData}
              tiposDisponibles={prendasSeleccionadas}
            />
          </div>
          <div className="flex justify-between">
            <button onClick={() => onGoSubstep(1)} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>
            <button
              onClick={() => {
                if (clothesData.length === 0) {
                  onShowAlert?.('Sin prendas', 'Agrega al menos una prenda antes de continuar.', 'shirt');
                  return;
                }
                onGoSubstep(3);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#050314] text-white rounded-lg hover:bg-gray-800"
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: ÁREAS */}
      {substepActual === 3 && (
        <div>
          <div className="flex flex-row items-start gap-3 px-4 py-3 mb-4 bg-amber-50 border border-amber-200 rounded-xl">
            <TriangleAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed text-amber-800">
              Activa las áreas que participarán en la producción de esta orden. Puedes agregar actividades específicas a cada área activa.
            </p>
          </div>

          {areasActivas && (
            <AreasFormMobile
              areasActivas={areasActivas}
              onToggleArea={onToggleArea}
              onQuitarActividad={onQuitarActividad}
              onAbrirModalActividades={onAbrirModalActividades}
              onSelectTagOp={onSelectTagOp}
              onToggleMulti={onToggleMulti}
              onTextChange={onTextChange}
              onViewChange={setMobileAreasView}
              onCustomOtroToggle={onCustomOtroToggle}
              onCustomOtroChange={onCustomOtroChange}
            />
          )}

          {mobileAreasView !== 'panel' && (
            <div className="flex justify-between mt-4">
              <button onClick={() => onGoSubstep(2)} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>
              <button
                onClick={() => {
                  const tieneAreas = (areasActivas || []).some((a) => a.activa);
                  if (!tieneAreas) {
                    onShowAlert?.('Áreas requeridas', 'Debes seleccionar al menos un área para continuar.', 'alert-circle');
                    return;
                  }
                  onGoSubstep(4);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#050314] text-white rounded-lg hover:bg-gray-800"
              >
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* STEP 4: SECUENCIA */}
      {substepActual === 4 && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-base font-bold text-gray-900 mb-4">Secuencia de Producción</h2>
            <div className="space-y-2">
              {areasSecuencia.map((nombre, idx) => (
                <div key={nombre} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white text-sm font-medium">
                  <span className="w-6 h-6 rounded-full bg-gray-100 text-[#050314] flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                  <span className="text-gray-900">{nombre}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <button onClick={() => onGoSubstep(3)} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>
            <button onClick={() => onGoSubstep(5)} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#050314] text-white rounded-lg hover:bg-gray-800">
              Ver Resumen <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: RESUMEN */}
      {substepActual === 5 && (
        <div>
          <ResumenView
            disciplina={disciplina} categoria={categoria} tipoSolicitud={tipoSolicitud}
            observaciones={observaciones} tipoDiseno={tipoDiseno}
            prendasSeleccionadas={prendasSeleccionadas} clothesData={clothesData}
            adjuntosData={adjuntosData} areasActivas={areasActivas}
            areasSecuencia={areasSecuencia} pedidoActivo={pedidoActivo}
          />
          <div className="flex justify-between mt-4">
            <button onClick={() => onGoSubstep(4)} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <ChevronLeft className="w-4 h-4" /> Editar
            </button>
            <button onClick={onConfirmarOrden} className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium bg-[#050314] text-white rounded-lg hover:bg-gray-800">
              <CheckCircle className="w-4 h-4" /> Confirmar orden
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
