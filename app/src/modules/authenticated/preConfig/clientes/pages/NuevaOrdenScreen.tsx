import { useState, useEffect, useMemo, useRef } from 'react';

import {
  ChevronLeft, ChevronRight, ChevronDown,
  ClipboardList, Shirt, Image, Pencil, Upload,
  Plus, Info, TriangleAlert, CheckCircle,
  GripVertical, ArrowDownUp, AlertCircle, X, Search,
  Box, Package
} from 'lucide-react';

import { ReactComponent as Pants } from '../assets/icons/pants';

import AdjuntoItem from './AdjuntoItem';
import PrendasEditor from './PrendasEditor';

import { prendasCatalogo } from '../data/catalogos';
import { generarCodigo, tipoSolicitudLimpio } from '../utils/helpers';


// ── Traductor de Emojis a Iconos ───────────────────────────────────────────────
function renderIconoPrenda(emoji: string) {
  switch (emoji) {
    case '👕': return <Shirt className="w-6 h-6" />;
    case '🩳': return <Pants className="w-6 h-6" />;
    case '🎒': return <Box className="w-6 h-6" />;
    case '📦': return <Package className="w-6 h-6" />;
    default: return <Shirt className="w-6 h-6" />;
  }
}

// ── Inline field error ────────────────────────────────────────────────────────

// ── Inline field error ────────────────────────────────────────────────────────
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600">
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {msg}
    </div>
  );
}

// ── Char counter ──────────────────────────────────────────────────────────────
function CharCounter({ current, max }: { current: number; max: number }) {
  const near = current >= max * 0.85;
  const over = current >= max;
  if (!near) return null;
  return (
    <span className={`text-[11px] ml-1 ${over ? 'text-red-600 font-semibold' : 'text-amber-600'}`}>
      {current}/{max}
    </span>
  );
}

// ── Step bar ──────────────────────────────────────────────────────────────────
function StepBar({ substepActual, maxSubstep, onGoSubstepNav }: any) {
  const steps = [
    { n: 1, label: 'General' },
    { n: 2, label: 'Prendas' },
    { n: 3, label: 'Áreas' },
    { n: 4, label: 'Secuencia' },
    { n: 5, label: 'Resumen' },
  ];
  return (
    <div className="flex items-center mb-7 flex-wrap gap-1">
      {steps.map((s, idx) => {
        const isDone = s.n < substepActual;
        const isActive = s.n === substepActual;
        const isVisited = s.n <= maxSubstep;
 const isVisitedOnly = isVisited && !isDone && !isActive;
        const cls = `step${isActive ? ' active' : ''}${isDone ? ' done' : ''}${isVisitedOnly ? ' visited' : ''}${isVisited ? ' clickable' : ''}`;
      return (
          <div key={s.n} style={{ display: 'contents' }}>
            <div
              className={cls}
              style={{ cursor: isVisited ? 'pointer' : 'default', opacity: isVisited ? 1 : 0.4 }}
              onClick={() => isVisited && onGoSubstepNav(s.n)}
              title={s.label}
            >
              <div className="step-dot">{isDone ? '✓' : s.n}</div>
              {s.label}
            </div>
 {idx < steps.length - 1 && <div className={`step-line${isDone ? ' step-line-filled' :''}`}></div>}
          </div>
        );
      })}
    </div>
  );
}


function ActividadOpciones({ act, areaIdx, actIdx, onSelectTagOp, onToggleMulti, onTextChange, onCustomOtroToggle, onCustomOtroChange }: any) {
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
      {act.opciones.map((op: string) => {
        let isCustom = false;
        let displayOp = op;
        let savePrefix = op;

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
        
        const opts = act.selectedOptions || [];
        const isSel = isCustom 
          ? opts.some((o: string) => o.startsWith(savePrefix.trim()) || o === '__otro__') 
          : opts.includes(op);

        const customVal = (isSel && isCustom) 
          ? (opts.find((o: string) => o.startsWith(savePrefix.trim())) || '').substring(savePrefix.length) 
          : '';

        return (
          <div key={op} className="flex items-center gap-2 flex-wrap mt-1">
            <div
              className={`tag-option ${multi ? 'multi' : ''} ${isSel ? 'selected' : ''}`}
              onClick={() => {
                const valueToSave = isCustom ? savePrefix : op;
                if (multi) onToggleMulti(areaIdx, actIdx, valueToSave);
                else onSelectTagOp(areaIdx, actIdx, valueToSave);
              }}
            >
              {displayOp}
            </div>
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
function AreasForm({ areasActivas, onToggleArea, onQuitarActividad, onAbrirModalActividades, onSelectTagOp, onToggleMulti, onTextChange, onCustomOtroToggle, onCustomOtroChange, tpuAlert }: any) {
  // Inline confirmation state for removing an activity
  const [pendingRemove, setPendingRemove] = useState<{ ai: number; li: number } | null>(null);

  function handleQuitarClick(ai: number, li: number) {
    setPendingRemove({ ai, li });
  }
  function handleConfirmRemove() {
    if (pendingRemove) {
      onQuitarActividad(pendingRemove.ai, pendingRemove.li);
      setPendingRemove(null);
    }
  }
  function handleCancelRemove() {
    setPendingRemove(null);
  }

  return (
    <div>
      {areasActivas.map((area: any, ai: number) => {
        const activa = area.activa;
        return (
          <div key={area.nombre} className="area-block">
            <div className={`area-header${activa ? '' : ' area-header-inactive'}`}>
              <div className="area-dot" style={{ background: area.color, opacity: activa ? 1 : 0.4 }}></div>
              <span style={{ opacity: activa ? 1 : 0.5 }}>{area.nombre}</span>
              {activa && area.actividades.length > 0 && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700">{area.actividades.length}</span>
              )}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-gray-400">{activa ? 'Participa' : 'No participa'}</span>
                <label className="switch" onClick={e => e.stopPropagation()}>
                  <input type="checkbox" checked={activa} onChange={e => onToggleArea(ai, e.target.checked)} />
                  <div className="switch-track"></div>
                  <div className="switch-thumb"></div>
                </label>
              </div>
            </div>
            {activa && (
              <div className="area-body">
                {area.actividades.map((act: any, li: number) => {
                  const isPendingThis = pendingRemove?.ai === ai && pendingRemove?.li === li;
                  return (
                    <div key={`${act.nombre}-${li}`} className="border-b-2 border-gray-300 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
                      <div className="actividad-simple-inner">
                        {/* Nuevo contenedor flex para alinear el título y el botón en la misma fila */}
                        <div className="flex items-center justify-between mb-3">

                          {/* Título y Badge */}
                          <div className="actividad-label flex items-center gap-2">
                            {act.nombre}
                            {act.tipo === 'checkbox'
                              ? <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-green-100 text-green-700 normal-case tracking-normal">opción múltiple</span>
                              : act.tipo === 'radio'
                                ? <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 normal-case tracking-normal">opción única</span>
                                : act.tipo === 'texto'
                                  ? <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 normal-case tracking-normal">texto libre</span>
                                  : null
                            }
                          </div>

                          {/* Lógica del botón Quitar movida aquí arriba */}
                          {isPendingThis ? (
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <span className="text-xs text-gray-500 mr-1">¿Quitar?</span>
                              <button onClick={handleConfirmRemove} className="px-2 py-0.5 rounded text-xs font-semibold bg-red-500 text-white hover:bg-red-600">Sí</button>
                              <button onClick={handleCancelRemove} className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200">No</button>
                            </div>
                          ) : (
                            <button
                              className="flex-shrink-0 px-2.5 py-1 rounded-md text-xs font-semibold text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
                              onClick={() => handleQuitarClick(ai, li)}
                            >
                              Quitar
                            </button>
                          )}
                        </div>

                        {/* Opciones (Azul marino, Rojo, etc.) */}
                        <ActividadOpciones act={act} areaIdx={ai} actIdx={li} onSelectTagOp={onSelectTagOp} onToggleMulti={onToggleMulti} onTextChange={onTextChange} onCustomOtroToggle={onCustomOtroToggle} onCustomOtroChange={onCustomOtroChange} />

                        {act.nota && (
                          <div className="flex items-start gap-2 mt-2.5 p-2.5 rounded-lg bg-yellow-50 border border-yellow-200">
                            <Info className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-yellow-800 leading-relaxed font-medium">{act.nota}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div className="add-actividad-row" onClick={() => onAbrirModalActividades(ai)}>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar actividad</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
      {tpuAlert && (
        <div className="flex items-start gap-3 p-3.5 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-700 mb-4">
          <TriangleAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="text-xs leading-relaxed">
            <strong className="font-semibold block">TPU 3D seleccionado</strong>
            El tiempo de fabricación se extiende 10–15 días hábiles. Coordina con el cliente.
          </div>
        </div>
      )}
    </div>
  );
}

// ── Secuencia step (unchanged) ────────────────────────────────────────────────



// ── Secuencia step ────────────────────────────────────────────────
const ITEM_H = 84;

function SecuenciaStep({ areasActivas, areasSecuencia, setAreasSecuencia, onGoSubstep }: any) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dropIdx, setDropIdx] = useState<number | null>(null);
  const gripPressed = useRef(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // NUEVO: Referencia para controlar el ciclo de auto-scroll
  const autoScrollRef = useRef<number | null>(null);

  useEffect(() => {
    const activeNames = (areasActivas || []).filter((a: any) => a.activa).map((a: any) => a.nombre);
    const currentValid = areasSecuencia.filter((n: string) => activeNames.includes(n));
    const newNames = activeNames.filter((n: string) => !areasSecuencia.includes(n));
    if (currentValid.length !== areasSecuencia.length || newNames.length > 0) {
      setAreasSecuencia([...currentValid, ...newNames]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const previewOrder = useMemo(() => {
    if (dragIdx === null || dropIdx === null || dragIdx === dropIdx) return areasSecuencia;
    const next = [...areasSecuencia];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(dropIdx, 0, moved);
    return next;
  }, [areasSecuencia, dragIdx, dropIdx]);

  const slotOf = useMemo(() => {
    const m: Record<string, number> = {};
    previewOrder.forEach((n: string, i: number) => { m[n] = i; });
    return m;
  }, [previewOrder]);

  // NUEVO: Funciones para iniciar y detener el scroll automático
  const startAutoScroll = (direction: 'up' | 'down') => {
    if (autoScrollRef.current) return; // Si ya está scrolleando, no hacemos nada
    const scrollStep = () => {
      window.scrollBy(0, direction === 'down' ? 15 : -15);
      autoScrollRef.current = requestAnimationFrame(scrollStep);
    };
    autoScrollRef.current = requestAnimationFrame(scrollStep);
  };

  const stopAutoScroll = () => {
    if (autoScrollRef.current !== null) {
      cancelAnimationFrame(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  };

  function commitDrop() {
    stopAutoScroll(); // Detenemos el scroll al soltar
    if (dragIdx === null || dropIdx === null || dragIdx === dropIdx) {
      setDragIdx(null); setDropIdx(null); return;
    }
    const next = [...areasSecuencia];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(dropIdx, 0, moved);
    setAreasSecuencia(next);
    setDragIdx(null); setDropIdx(null);
  }

  const activeAreas = (areasActivas || []).filter((a: any) => a.activa);
  const anyDragging = dragIdx !== null;

  if (activeAreas.length === 0) {
    return (
      <div>
        <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-yellow-50 border border-yellow-100 rounded-xl">
          <TriangleAlert className="w-4 h-4 text-yellow-500 flex-shrink-0" />
          <p className="text-xs text-yellow-700 font-medium">
            No hay áreas activas. Regresa al paso anterior y activa al menos un área.
          </p>
        </div>
        <div className="form-nav">
          <button onClick={() => onGoSubstep(3)} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>
          <div></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 px-4 py-3 mb-5 bg-blue-50 border border-blue-100 rounded-xl">
        <ArrowDownUp className="w-4 h-4 text-blue-500 flex-shrink-0" />
        <p className="text-xs text-blue-700 font-medium">
          Usa el ícono <strong className="font-black">⠿</strong> de cada tarjeta para arrastrarla y reordenar el flujo de producción.
        </p>
      </div>
      <div
        className="relative mb-6"
        style={{ height: `${areasSecuencia.length * ITEM_H}px` }}
        onDragOver={e => e.preventDefault()}
        ref={containerRef}
        onTouchMove={(e) => {
          if (dragIdx === null) return;
          const y = e.touches[0].clientY;

          // --- LÓGICA DE AUTO-SCROLL ---
          const edgeThreshold = 80; // Zona sensible (píxeles desde el borde)
          if (y > window.innerHeight - edgeThreshold) {
            startAutoScroll('down');
          } else if (y < edgeThreshold) {
            startAutoScroll('up');
          } else {
            stopAutoScroll();
          }
          // -----------------------------

          const rect = containerRef.current?.getBoundingClientRect();
          if (!rect) return;
          const relY = y - rect.top;
          const targetSlot = Math.max(0, Math.min(areasSecuencia.length - 1, Math.floor(relY / ITEM_H)));
          const nameAtSlot = previewOrder[targetSlot];
          const targetOrigIdx = areasSecuencia.indexOf(nameAtSlot);
          if (targetOrigIdx !== -1 && targetOrigIdx !== dragIdx) setDropIdx(targetOrigIdx);
        }}
        onTouchEnd={() => commitDrop()}
        onTouchCancel={() => { stopAutoScroll(); setDragIdx(null); setDropIdx(null); }}
        onDrop={e => { e.preventDefault(); commitDrop(); }}
      >
        {areasSecuencia.map((nombre: string, originalIdx: number) => {
          const area = (areasActivas || []).find((a: any) => a.nombre === nombre);
          if (!area) return null;
          const isSource = dragIdx === originalIdx;
          const isTarget = dropIdx === originalIdx && anyDragging && !isSource;
          const slot = slotOf[nombre] ?? originalIdx;
          const seqNum = slot + 1;
          return (
            <div
              key={nombre}
              draggable
              onDragStart={e => {
                if (!gripPressed.current) { e.preventDefault(); return; }
                gripPressed.current = false;
                e.dataTransfer.effectAllowed = 'move';
                setDragIdx(originalIdx);
                setDropIdx(null);
              }}
              onDragEnd={() => { stopAutoScroll(); setDragIdx(null); setDropIdx(null); }}
              onDragEnter={e => { e.preventDefault(); if (!isSource) setDropIdx(originalIdx); }}
              onDragOver={e => { e.preventDefault(); if (!isSource) setDropIdx(originalIdx); }}
              onDrop={e => { e.preventDefault(); e.stopPropagation(); commitDrop(); }}
              className={`group absolute left-0 right-0 h-[72px] flex items-center gap-4 rounded-2xl px-4 select-none border-2 ${isSource ? 'bg-gray-50 border-dashed border-gray-300 opacity-40 shadow-none'
                  : isTarget ? 'bg-white border-[#050314] shadow-2xl'
                    : 'bg-white border-transparent shadow-sm hover:shadow-md hover:border-gray-100'
                }`}
              style={{
                top: `${slot * ITEM_H}px`,
                zIndex: isSource ? 0 : isTarget ? 20 : 1,
                cursor: isSource ? 'grabbing' : 'default',
                transition: isSource ? 'opacity 150ms ease' : 'top 220ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 150ms ease, border-color 150ms ease',
              }}
            >
              <div
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-base"
                style={{
                  backgroundColor: isSource ? '#f9fafb' : `${area.color}18`,
                  border: `2.5px solid ${isSource ? '#e5e7eb' : area.color}`,
                  color: isSource ? '#d1d5db' : area.color,
                  boxShadow: isSource ? 'none' : `0 0 0 3px ${area.color}14`,
                  transition: 'all 220ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                {seqNum}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: isSource ? '#e5e7eb' : area.color }} />
                  <span className={`text-sm font-semibold truncate ${isSource ? 'text-gray-300' : 'text-gray-900'}`}>{area.nombre}</span>
                </div>
                <p className={`text-xs ml-4 transition-colors duration-150 ${isTarget ? 'text-[#050314] font-semibold' : isSource ? 'text-gray-300' : 'text-gray-400'}`}>
                  {isTarget ? '↕ Suelta aquí para colocar' : isSource ? 'Moviendo…' : `Etapa ${seqNum}`}
                </p>
              </div>
              <div
                className={`flex-shrink-0 p-2 rounded-xl transition-all duration-150 cursor-grab active:cursor-grabbing ${isSource ? 'text-gray-200 bg-transparent'
                    : isTarget ? 'text-[#050314] bg-gray-100'
                      : 'text-gray-300 group-hover:text-gray-500 group-hover:bg-gray-50'
                  }`}
                onMouseDown={() => { gripPressed.current = true; }}
                style={{ touchAction: 'none' }}
                onTouchStart={() => { setDragIdx(originalIdx); setDropIdx(null); }}
                onMouseUp={() => { gripPressed.current = false; }}
              >
                <GripVertical className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>
      <div className="form-nav">
        <button onClick={() => onGoSubstep(3)} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          <ChevronLeft className="w-4 h-4" /> Anterior
        </button>
        <button onClick={() => onGoSubstep(5)} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#050314] text-white rounded-lg hover:bg-gray-800">
          Ver resumen <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


// ── Resumen ───────────────────────────────────────────────────────────────────
function ResumenView({ disciplina, categoria, tipoSolicitud, observaciones, tipoDiseno, prendasSeleccionadas, clothesData, adjuntosData, areasActivas, areasSecuencia, pedidoActivo }: any) {
  const code = generarCodigo(disciplina, tipoSolicitud, pedidoActivo?.id);
  const grupos: Record<string, any[]> = { hombre: [], mujer: [], niño: [] };
  clothesData.forEach((c: any) => { if (grupos[c.conf.type]) grupos[c.conf.type].push(c); });
  const totalPiezas = clothesData.reduce((s: number, c: any) => s + (c.conf.tot || 0), 0);
  const tipoSolDisplay = tipoSolicitudLimpio(tipoSolicitud);
  const areasActuales = areasActivas || [];
  const disenoBadgeMap: Record<string, string> = {
    Nuevo: 'bg-blue-50 text-blue-700', Pasado: 'bg-green-50 text-green-700', Ambos: 'bg-purple-50 text-purple-700',
  };
  const disenoCls = disenoBadgeMap[tipoDiseno] || 'bg-gray-100 text-gray-700';

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Código de orden (preview)</div>
        <div className="code-box">{code}</div>
        <div className="text-[11px] text-gray-400 mt-1.5">El contador (????) se asignará al confirmar.</div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3 pb-2.5 border-b border-gray-100">Información general</div>
        <div className="resumen-grid">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Tipo de diseño</div>
            <span className={`inline-flex px-2.5 py-1 rounded text-sm font-semibold ${disenoCls}`}>{tipoDiseno}</span>
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
              {/* Se agregaron clases de Tailwind para centrar: flex flex-wrap justify-center gap-4 */}
              <div className="cloth-resumen-grid flex flex-wrap justify-center gap-4">
                {items.map((c: any) => (
                  <div key={c.id} className="cloth-resumen-card">
                    <div className="cloth-resumen-qty">{c.conf?.tot || 0}</div>
                    <div className="cloth-resumen-detail text-center">
                      <div className="cloth-resumen-name">{c.name}</div>
                      {/* Se agregó un fallback para capturar el nombre real de la propiedad */}
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
            ? areasSecuencia.map((n: string) => areasActuales.find((a: any) => a.nombre === n)).filter((a: any) => a && a.activa && a.actividades.length > 0)
            : areasActuales.filter((a: any) => a.activa && a.actividades.length > 0);
          if (areasOrdenadas.length === 0) return <div className="text-sm text-gray-400">Sin áreas activas</div>;
          return areasOrdenadas.map((area: any, seqIdx: number) => (
            <div key={area.nombre}>
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ backgroundColor: area.color + '20', color: area.color, border: `1.5px solid ${area.color}` }}>{seqIdx + 1}</div>
                  <div className="text-xs font-semibold" style={{ color: area.color }}>{area.nombre}</div>
                </div>
                {area.actividades.map((act: any, ai: number) => {
                  const opts = act.selectedOptions || [];
                  if (!opts.length) return null;
                  return (
                    <div key={ai} className="mb-1.5 text-xs ml-7">
                      <span className="text-gray-400">{act.nombre}: </span>
                      {act.tipo === 'texto' ? <span className="text-gray-700 italic">{opts[0]}</span> : (
                        <span className="flex flex-wrap gap-1 mt-1 inline-flex">
                          {opts.map((op: string) => <span key={op} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">{op}</span>)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              {seqIdx < areasOrdenadas.length - 1 && (
                <div className="flex flex-col items-center my-0.5 ml-2.5">
                  <div className="w-0.5 h-3 bg-gray-200"></div>
                  <ChevronDown 
                    className="w-3 h-3 text-gray-300" />
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
            : adjuntosData.map((a: any) => <span key={a.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">📎 {a.nombre}</span>)
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

// ── Mobile-only Areas flow (<lg breakpoint) ───────────────────────────────────
// Replaces AreasForm on phones/tablets. Follows the two-view pattern from the
// reference HTML: a "list" view (area cards) and a "panel" view (activity config).

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
}: any) {
  const [mobileView, setMobileView] = useState<'list' | 'panel'>('list');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showPicker, setShowPicker] = useState(false);
  const [mobileAlert, setMobileAlert] = useState<{ title: string; msg: string } | null>(null);

  // 1. Estado para el buscador
  const [filtro, setFiltro] = useState('');

  const areas: any[] = areasActivas || [];

  // CORREGIDO: Primero separamos activas e inactivas...
  const activeAreas = areas.filter((a: any) => a.activa);
  const inactiveAreas = areas.filter((a: any) => !a.activa);
  const selectedArea = selectedIdx !== null ? areas[selectedIdx] : null;

  // CORREGIDO: ...y después filtramos las inactivas (Evita error de inicialización)
  const filteredInactiveAreas = inactiveAreas.filter((area: any) =>
    area.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  function switchView(v: 'list' | 'panel') {
    setMobileView(v);
    onViewChange?.(v);
  }

  function addArea(idx: number) {
    onToggleArea(idx, true);
    setShowPicker(false);
    setSelectedIdx(idx);
    setIsCreating(true);
    setExpanded({});
    setFiltro(''); // Limpiamos el buscador al agregar para la próxima vez
    switchView('panel');
  }

  function editArea(idx: number) {
    setSelectedIdx(idx);
    setIsCreating(false);
    setExpanded({});
    switchView('panel');
  }

  function deactivateArea(idx: number) {
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
    const allDone = acts.every((a: any) => (a.selectedOptions || []).length > 0);
    if (!allDone) {
      setMobileAlert({ title: 'Actividades incompletas', msg: 'Completa todas las actividades (selecciona al menos una opción en cada una) antes de guardar.' });
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

  function toggleExpand(key: string) {
    setExpanded(prev => {
      if (prev[key]) {
        return {};
      }
      return { [key]: true };
    });
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

  // ══════════════════════════════════════════════════════════════════════════
  //  VISTA A — Lista de áreas activas
  // ══════════════════════════════════════════════════════════════════════════
  if (mobileView === 'list') {
    return (
      <div>
        {/* Add area CTA */}
        {inactiveAreas.length > 0 && (
          <button
            onClick={() => setShowPicker(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-[#050314] text-white rounded-2xl text-sm font-bold mb-3 hover:bg-gray-800 active:opacity-90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar área de producción
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Empty state */}
        {activeAreas.length === 0 && (
          <div className="text-center py-10 px-4 border-2 border-dashed border-gray-200 rounded-2xl mb-3 bg-gray-50">
            <div className="text-4xl mb-2">🏭</div>
            <div className="text-sm font-bold text-gray-700 mb-1">Aún no hay áreas seleccionadas</div>
            <div className="text-xs text-gray-400 leading-relaxed">
              Toca <strong>"Agregar área de producción"</strong> para seleccionar las áreas que participarán en esta orden
            </div>
          </div>
        )}

        {/* Active area cards */}
        {activeAreas.map((area: any) => {
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

        {/* Area picker — Adaptativo */}
        {showPicker && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-6">
            <div className="absolute inset-0 bg-black/45 transition-opacity" onClick={() => setShowPicker(false)} />

            <div className="relative w-full md:max-w-md bg-white rounded-t-3xl md:rounded-2xl shadow-2xl flex flex-col  h-[80vh] overflow-hidden pb-6 md:pb-0">

              {/* Header CORREGIDO: El buscador ya no comparte espacio con el justify-between */}
              <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
                <div className="text-xs font-bold text-gray-500">
                  Selecciona un área para agregar:
                </div>
                <button
                  onClick={() => { setShowPicker(false); setFiltro(''); }}
                  className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-200 p-1.5 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Buscador CORREGIDO: En su propia fila limpia */}
              <div className="px-5 py-2.5 border-b border-gray-100 flex-shrink-0 bg-gray-50/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar área…"
                    value={filtro}
                    onChange={e => setFiltro(e.target.value)} // CORREGIDO: setFiltro en lugar de setSearchTerm
                    className="pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-400 w-full"
                  />
                </div>
              </div>

              {/* Lista de áreas con scroll interno CORREGIDA */}
              <div className="overflow-y-auto flex-1">
                {inactiveAreas.length === 0 ? (
                  <div className="px-5 py-8 text-sm text-gray-400 text-center">Todas las áreas ya están agregadas.</div>
                ) : filteredInactiveAreas.length === 0 ? (
                  // Caso extra: Si hay áreas disponibles pero la búsqueda no coincide con ninguna
                  <div className="px-5 py-8 text-sm text-gray-400 text-center">No se encontraron áreas con ese nombre.</div>
                ) : (
                  // CORREGIDO: Mapeamos filteredInactiveAreas en lugar de inactiveAreas
                  filteredInactiveAreas.map((area: any) => {
                    const idx = areas.indexOf(area); // Sigue funcionando perfecto para traer el índice global real
                    return (
                      <button
                        key={area.nombre}
                        onClick={() => addArea(idx)}
                        className="w-full flex items-center gap-3 px-5 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                      >
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: area.color || '#6b7280' }} />
                        <span className="flex-1 text-sm font-semibold text-gray-800">{area.nombre}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {AlertOverlay}
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  VISTA B — Panel de configuración de un área
  // ══════════════════════════════════════════════════════════════════════════
  if (!selectedArea) return null;
  const areaColor = selectedArea.color || '#6b7280';
  const actividades: any[] = selectedArea.actividades || [];
  const allDone = actividades.length > 0 && actividades.every((a: any) => (a.selectedOptions || []).length > 0);

  return (
    <div>
      {/* Panel header */}
      <div
        className="flex items-center gap-2 pb-3 mb-3"
        style={{ borderBottom: `2px solid ${areaColor}` }}
      >
        {!isCreating && (
          <button
            onClick={cancelEdit}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-200 transition-colors flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4" /> Volver
          </button>
        )}
        <div className="flex items-center gap-2 flex-1 justify-center">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: areaColor }} />
          <span className="text-sm font-extrabold text-gray-900">{selectedArea.nombre}</span>
        </div>
        {!isCreating && <div className="flex-shrink-0 w-20" />}
      </div>

      {/* Hint */}
      <p className="text-xs text-gray-400 text-center leading-relaxed px-2 mb-4">
        Agrega y completa las actividades de esta área. Cada actividad debe quedar configurada antes de continuar.
      </p>

      {/* Empty actividades */}
      {actividades.length === 0 && (
        <div className="text-center py-8 px-4 border-2 border-dashed border-gray-200 rounded-2xl mb-3 bg-gray-50">
          <div className="text-3xl mb-2">📋</div>
          <div className="text-sm font-bold text-gray-700 mb-1">No hay actividades todavía</div>
          <div className="text-xs text-gray-400 leading-relaxed">
            Toca <strong>"Agregar actividad a esta área"</strong> para añadir la primera
          </div>
        </div>
      )}

      {/* Activity accordion cards */}
      {actividades.map((act: any, li: number) => {
        const key = `${selectedIdx}-${li}`;
        const isOpen = !!expanded[key];
        const opts: string[] = act.selectedOptions || [];
        const isConfigured = opts.length > 0;

        return (
          <div
            key={key}
            className={`rounded-2xl mb-2 overflow-hidden border-2 bg-white transition-colors ${isConfigured ? 'border-gray-200' : 'border-amber-300'}`}
          >
            {/* Accordion header */}
            <button
              onClick={() => toggleExpand(key)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-gray-900">{act.nombre}</div>
                {!isOpen && (
                  isConfigured ? (
                    act.tipo === 'texto' ? (
                      <div className="text-xs text-gray-500 italic mt-0.5 truncate">{opts[0]}</div>
                    ) : (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {opts.map((op: string) => (
                          <span
                            key={op}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-200"
                          >
                            {op === '__otro__' ? 'Otro:' : op}
                          </span>
                        ))}
                      </div>
                    )
                  ) : (
                    <div className="text-xs text-amber-600 font-medium mt-0.5">⚠ Toca aquí para completar esta actividad</div>
                  )
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Accordion body */}
            {isOpen && (
              <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                <div className="flex items-start justify-between gap-2 mb-3 pt-3">
                  <p className="text-xs text-gray-500 flex-1 leading-relaxed">
                    {act.tipo === 'radio'
                      ? '👆 Toca una opción para seleccionarla:'
                      : act.tipo === 'checkbox'
                        ? '👆 Puedes seleccionar una o varias opciones:'
                        : '✏️ Escribe la información requerida:'}
                  </p>
                  <button
                    onClick={() => onQuitarActividad(selectedIdx!, li)}
                    className="flex-shrink-0 text-xs font-semibold text-red-500 border border-red-200 rounded-lg px-2.5 py-1 whitespace-nowrap hover:bg-red-50 transition-colors"
                  >
                    Quitar
                  </button>
                </div>

                {/* CORREGIDO: Se removió texto duplicado suelto que estaba aquí */}
                {act.tipo === 'texto' ? (
                  <textarea
                    className="w-full min-h-[64px] px-3 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm text-gray-900 resize-none outline-none focus:border-gray-400 transition-colors font-sans leading-relaxed"
                    placeholder="Escribe aquí…"
                    value={opts[0] || ''}
                    onChange={e => onTextChange(selectedIdx!, li, e.target.value)}
                  />
                ) : (
                 <div className="flex flex-wrap gap-2 my-3 items-center">
                    {act.opciones.map((op: string) => {
                      let isCustom = false;
                      let displayOp = op;
                      let savePrefix = op;

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
                      
                      const isSel = isCustom 
                        ? opts.some((o: string) => o.startsWith(savePrefix.trim()) || o === '__otro__') 
                        : opts.includes(op);
                      const multi = act.tipo === 'checkbox';

                      const customVal = (isSel && isCustom) 
                        ? (opts.find((o: string) => o.startsWith(savePrefix.trim())) || '').substring(savePrefix.length) 
                        : '';

                      return (
                        <div key={op} className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => {
                              const valueToSave = isCustom ? savePrefix : op;
                              if (multi) {
                                onToggleMulti(selectedIdx!, li, valueToSave);
                              } else {
                                onSelectTagOp(selectedIdx!, li, valueToSave);
                                // Nota: Eliminamos toggleExpand(key) para que la tarjeta no se cierre sola
                              }
                            }}
                            className={`px-4 py-2 rounded-full text-xs font-semibold border-2 transition-all whitespace-nowrap ${isSel
                              ? multi
                                ? 'bg-pink-50 text-pink-700 border-pink-300'
                                : 'bg-blue-50 text-blue-700 border-blue-300'
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            {displayOp}
                          </button>
                          
                          {isSel && isCustom && (
                            <input
                              type="text"
                              placeholder="Especificar..."
                              value={customVal}
                              onChange={e => onCustomOtroChange(selectedIdx!, li, savePrefix, e.target.value, multi)}
                              className="px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:border-gray-500 min-w-[150px] flex-1 max-w-[250px] bg-white shadow-sm transition-colors"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {act.nota && (
                  <div className="flex items-start gap-2 mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <Info className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-blue-700 font-medium leading-relaxed">{act.nota}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Add activity button */}
      <button
        onClick={() => onAbrirModalActividades(selectedIdx!)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-[#050314] text-white rounded-2xl text-sm font-bold mb-3 mt-1 hover:bg-gray-800 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Agregar actividad a esta área
      </button>

      {/* Panel footer */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
        <button
          onClick={isCreating ? cancelCreate : cancelEdit}
          className="px-4 py-2.5 text-sm font-semibold bg-white border-2 border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={confirmPanel}
          disabled={!allDone}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold rounded-xl transition-colors ${allDone
            ? 'bg-[#050314] text-white hover:bg-gray-800'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isCreating ? 'Agregar área' : 'Guardar'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {AlertOverlay}
    </div>
  );
}

// ── Main NuevaOrdenScreen ─────────────────────────────────────────────────────

const DISC_MAX = 60;
const TIPO_MAX = 60;
const OBS_MAX = 300;
const ADJ_MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ADJ_MAX_COUNT = 10;
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'pdf', 'txt', 'doc', 'docx'];

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
  snapshotOriginal,
  onSalirNuevaOrden, onConfirmarOrden,
  onAbrirModalActividades,
  onHandleAdjuntos, onQuitarAdjunto,
  onGoSubstep, onGoSubstepNav,
  onShowAlert,
}: any) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // Mobile-only: track whether the areas panel is open (hides the step nav)
  const [mobileAreasView, setMobileAreasView] = useState<'list' | 'panel'>('list');

  // Step 1 validation errors
  const [step1Touched, setStep1Touched] = useState(false);

  // Adjunto error
  const [adjError, setAdjError] = useState('');

  const codePreview = generarCodigo(disciplina, tipoSolicitud, pedidoActivo?.id);

  function toggleSection(id: string) {
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function actualizarBadgeDiseno(newDisciplina: string, newPrendasSeleccionadas: string[]) {
    if (!esReutilizado) { setTipoDiseno('Nuevo'); return; }
    const disc = newDisciplina !== undefined ? newDisciplina : disciplina;
    const prendas = (newPrendasSeleccionadas || prendasSeleccionadas).slice().sort().join(',');
    const snap = snapshotOriginal;
    if (snap && (disc !== snap.disciplina || prendas !== snap.prendas)) setTipoDiseno('Ambos');
    else if (snap) setTipoDiseno('Pasado');
  }

  function handleDisciplinaChange(val: string) {
    if (val.length > DISC_MAX) return;
    setDisciplina(val);
    if (esReutilizado) actualizarBadgeDiseno(val, prendasSeleccionadas);
  }

  function togglePrenda(nombre: string) {
    if (prendasSeleccionadas.includes(nombre)) {
      if (prendasSeleccionadas.length === 1) return;
      const newList = prendasSeleccionadas.filter((p: string) => p !== nombre);
      setPrendasSeleccionadas(newList);


            // Al deseleccionar un tipo de prenda en General, se eliminan también las
      // prendas ya configuradas de ese tipo en el paso de Prendas (huérfanas)

      setClothesData(clothesData.filter((c: any) => c.name !== nombre));
      if (esReutilizado) actualizarBadgeDiseno(disciplina, newList);
    } else {
      const newList = [...prendasSeleccionadas, nombre];
      setPrendasSeleccionadas(newList);
      if (esReutilizado) actualizarBadgeDiseno(disciplina, newList);
    }
  }

  // ── Step 1 validation ─────────────────────────────────────────────────────
  const step1Errors = {
    disciplina: !disciplina.trim() ? 'Disciplina es requerida' : disciplina.length > DISC_MAX ? `Máximo ${DISC_MAX} caracteres` : '',
    categoria: !categoria ? 'Selecciona una calidad de producto' : '',
    tipoSolicitud: !tipoSolicitud.trim() ? 'Tipo de solicitud es requerido' : tipoSolicitud.length > TIPO_MAX ? `Máximo ${TIPO_MAX} caracteres` : '',
    observaciones: observaciones.length > OBS_MAX ? `Máximo ${OBS_MAX} caracteres` : '',
  };
  const step1HasErrors = step1Errors.disciplina || step1Errors.categoria || step1Errors.tipoSolicitud || step1Errors.observaciones;

 function handleGoStep2() {
  setStep1Touched(true);

  if (prendasSeleccionadas.length === 0) {
    onShowAlert(
      'Prenda requerida',
      'Debes seleccionar al menos un tipo de prenda antes de continuar.',
      'shirt'
    );
    return;
  }

  if (step1HasErrors) return;

  onGoSubstep(2);
}

  // ── Areas ──────────────────────────────────────────────────────────────────
  function onToggleArea(areaIdx: number, activa: boolean) {
    setAreasActivas((prev: any[]) => prev.map((a: any, i: number) => i === areaIdx ? { ...a, activa } : a));
  }
  function onQuitarActividad(areaIdx: number, actIdx: number) {
    setAreasActivas((prev: any[]) => prev.map((a: any, i: number) =>
      i === areaIdx ? { ...a, actividades: a.actividades.filter((_: any, li: number) => li !== actIdx) } : a
    ));
  }
  function onSelectTagOp(areaIdx: number, actIdx: number, option: string) {
    setAreasActivas((prev: any[]) => prev.map((a: any, i: number) =>
      i !== areaIdx ? a : {
        ...a,
        actividades: a.actividades.map((act: any, li: number) =>
          li !== actIdx ? act : { ...act, selectedOptions: [option] }
        )
      }
    ));
  }

function onToggleMulti(areaIdx: number, actIdx: number, option: string) {
    setAreasActivas((prev: any[]) => prev.map((a: any, i: number) =>
      i !== areaIdx ? a : {
        ...a,
        actividades: a.actividades.map((act: any, li: number) => {
          if (li !== actIdx) return act;
          const opts = act.selectedOptions || [];
          
          const isCustom = option.includes(':');
          const cleanOption = isCustom ? option.split(':')[0] + ':' : option;
          
          const isIncluded = isCustom 
            ? opts.some((o: string) => o.startsWith(cleanOption)) 
            : opts.includes(option);
          
          let newOpts;
          if (isIncluded) {
            newOpts = isCustom 
              ? opts.filter((o: string) => !o.startsWith(cleanOption)) 
              : opts.filter((o: string) => o !== option);         
          } else {
            newOpts = [...opts, option];
          }
          return { ...act, selectedOptions: newOpts };
        })
      }
    ));
  }

  function onTextChange(areaIdx: number, actIdx: number, value: string) {
    setAreasActivas((prev: any[]) => prev.map((a: any, i: number) =>
      i !== areaIdx ? a : {
        ...a,
        actividades: a.actividades.map((act: any, li: number) =>
          li !== actIdx ? act : { ...act, selectedOptions: value ? [value] : [] }
        )
      }
    ));
  }

  function onCustomOtroChange(areaIdx: number, actIdx: number, baseOp: string, value: string, multi: boolean) {
    setAreasActivas((prev: any[]) => prev.map((a: any, i: number) => {
      if (i !== areaIdx) return a;
      return {
        ...a,
        actividades: a.actividades.map((act: any, li: number) => {
          if (li !== actIdx) return act;
          const opts = act.selectedOptions || [];
          const newValue = `${baseOp}${value}`; 

          if (multi) {
            const hasBase = opts.some((o: string) => o.startsWith(baseOp));
            if (hasBase) {
              return {
                ...act,
                selectedOptions: opts.map((o: string) => o.startsWith(baseOp) ? newValue : o)
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
  function onCustomOtroToggle(areaIdx: number, actIdx: number, newOpts: string[]) {
    // Esta función queda por compatibilidad si se usaba en otra parte, 
    // pero con la nueva lógica dinámica ya casi no será necesaria.
    setAreasActivas((prev: any[]) => prev.map((a: any, i: number) =>
      i !== areaIdx ? a : {
        ...a,
        actividades: a.actividades.map((act: any, li: number) =>
          li !== actIdx ? act : { ...act, selectedOptions: newOpts }
        )
      }
    ));
  }

  const tpuAlert = (areasActivas || []).some((area: any) =>
    area.activa && area.actividades.some((act: any) => act.selectedOptions?.some((op: string) => op.includes('TPU 3D')))
  );
  const noAreasActivas = (areasActivas || []).every((a: any) => !a.activa);

  // ── Adjuntos validated ─────────────────────────────────────────────────────
  function handleAdjuntosValidated(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setAdjError('');

    if (adjuntosData.length + files.length > ADJ_MAX_COUNT) {
      setAdjError(`Máximo ${ADJ_MAX_COUNT} archivos. Actualmente tienes ${adjuntosData.length}.`);
      event.target.value = '';
      return;
    }
    for (const f of files) {
      const ext = f.name.split('.').pop()?.toLowerCase() || '';
      if (!ALLOWED_MIME.includes(f.type) && !ALLOWED_EXT.includes(ext)) {
        setAdjError(`Tipo no permitido: "${f.name}". Usa JPG, PNG, PDF, DOCX o TXT.`);
        event.target.value = '';
        return;
      }
      if (f.size > ADJ_MAX_SIZE) {
        setAdjError(`"${f.name}" supera el límite de 10 MB.`);
        event.target.value = '';
        return;
      }
    }
    onHandleAdjuntos(event);
  }

  const kitInfo = pedidoActivo?.kits?.find((k: any) => k.id === kitDestino);
  const noSubText = kitDestino && kitInfo ? `Nueva orden para el kit "${kitInfo.nombre}"` : 'Completa los datos de producción';

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nueva orden</h1>
          <p className="text-sm text-gray-500 mt-1">{noSubText}</p>
        </div>
        <button onClick={onSalirNuevaOrden} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          <ChevronLeft className="w-4 h-4" /> Volver
        </button>
      </div>

      <StepBar substepActual={substepActual} maxSubstep={maxSubstep} onGoSubstepNav={onGoSubstepNav} />

      {/* ── STEP 1: GENERAL ── */}
      {substepActual === 1 && (
        <div>
          {/* Info general */}
          <div className={`form-section bg-white border border-gray-200 rounded-xl mb-4${collapsed['general'] ? ' collapsed' : ''}`}>
            <div className="form-section-header flex items-center justify-between px-5 py-3.5 border-b border-gray-100 cursor-pointer hover:bg-gray-50 rounded-t-xl" onClick={() => toggleSection('general')}>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <ClipboardList className="w-4 h-4 text-gray-500" /> Información general
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 chevron-icon" />
            </div>
            <div className="form-section-body p-5">
              <div className="field-row">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Tipo de diseño</label>
                  <div className="tag-group">
                    {['Nuevo', 'Pasado', 'Ambos'].map(val => (
                      <div key={val} className={`tag-option${tipoDiseno === val ? ' selected' : ''}`} onClick={() => setTipoDiseno(val)}>{val}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                    Disciplina <span className="text-red-500">*</span>
                    <CharCounter current={disciplina.length} max={DISC_MAX} />
                  </label>
                  <input
                    type="text"
                    value={disciplina}
                    onChange={e => handleDisciplinaChange(e.target.value)}
                    placeholder="Ej. Fútbol, Básquetbol…"
                    maxLength={DISC_MAX}
                    className={`field-input ${step1Touched && step1Errors.disciplina ? 'border-red-400 bg-red-50' : ''}`}
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
                    className={`field-input ${step1Touched && step1Errors.categoria ? 'border-red-400 bg-red-50' : ''}`}
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
              <div className="field-row">
                <div style={{ gridColumn: '1/-1' }}>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                    Tipo de solicitud <span className="text-red-500">*</span>
                    <span className="normal-case font-normal text-gray-400 ml-1">(forma parte del código de orden)</span>
                    <CharCounter current={tipoSolicitud.length} max={TIPO_MAX} />
                  </label>
                  <input
                    type="text"
                    value={tipoSolicitud}
                    onChange={e => { if (e.target.value.length <= TIPO_MAX) setTipoSolicitud(e.target.value); }}
                    placeholder="Ej. JuegoLocal, Entrenamiento, Portero…"
                    maxLength={TIPO_MAX}
                    className={`field-input ${step1Touched && step1Errors.tipoSolicitud ? 'border-red-400 bg-red-50' : ''}`}
                  />
                  {step1Touched && <FieldError msg={step1Errors.tipoSolicitud} />}
                </div>
              </div>
              <div className="mt-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Código de orden (preview)</div>
                <div className="code-box">{codePreview}</div>
              </div>
            </div>
          </div>

          {/* Prendas */}
          <div className={`form-section bg-white border border-gray-200 rounded-xl mb-4${collapsed['prendas'] ? ' collapsed' : ''}`}>
            <div className="form-section-header flex items-center justify-between px-5 py-3.5 border-b border-gray-100 cursor-pointer hover:bg-gray-50 rounded-t-xl" onClick={() => toggleSection('prendas')}>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <Shirt className="w-4 h-4 text-gray-500" /> Tipos de prenda
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 chevron-icon" />
            </div>
            <div className="form-section-body p-5">
              <div className="prendas-grid">
                {prendasCatalogo.map((p: any) => (
                  <div key={p.nombre} className={`prenda-chip${prendasSeleccionadas.includes(p.nombre) ? ' selected' : ''}`} onClick={() => togglePrenda(p.nombre)}>
                    <span className="icon flex items-center justify-center text-gray-700 mb-1.5">
                      {renderIconoPrenda(p.icono || p.icon)}
                    </span>
                    {p.nombre}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Adjuntos */}
          <div className={`form-section bg-white border border-gray-200 rounded-xl mb-4${collapsed['adjuntos'] ? ' collapsed' : ''}`}>
            <div className="form-section-header flex items-center justify-between px-5 py-3.5 border-b border-gray-100 cursor-pointer hover:bg-gray-50 rounded-t-xl" onClick={() => toggleSection('adjuntos')}>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <Image className="w-4 h-4 text-gray-500" />
                Archivos adjuntos <span className="text-xs font-normal text-gray-400 ml-1">(se guardan en el pedido)</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 chevron-icon" />
            </div>
            <div className="form-section-body p-5">
              {adjError && (
                <div className="flex items-center gap-2 mb-3 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{adjError}
                  <button onClick={() => setAdjError('')} className="ml-auto"><X className="w-3.5 h-3.5" /></button>
                </div>
              )}
              {/* Botón ocupa todo el ancho */}
              <div
                className="w-full border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 p-6 text-center cursor-pointer hover:border-gray-400 transition-colors mb-4"
                onClick={() => document.getElementById('adj-input')!.click()}
              >
                <Upload className="w-7 h-7 text-gray-400 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-500">Agregar imágenes</div>
                <div className="text-xs text-gray-400 mt-1">JPG, PNG, PDF, DOCX · máx. 10MB · hasta {ADJ_MAX_COUNT} archivos</div>
              </div>
              <input type="file" id="adj-input" multiple accept=".jpg,.jpeg,.png,.webp,.gif,.svg,.pdf,.txt,.doc,.docx" className="hidden" onChange={handleAdjuntosValidated} />

              {/* Imágenes debajo */}
              {adjuntosData.length === 0 ? (
                <div className="text-sm text-gray-400">Sin archivos adjuntos</div>
              ) : (
                <div className="adjunto-grid">
                  {adjuntosData.map((a: any, i: number) => (
                    <AdjuntoItem key={a.id || i} adjunto={a} index={i} scope="orden" onQuitar={onQuitarAdjunto} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Observaciones */}
          <div className={`form-section bg-white border border-gray-200 rounded-xl mb-4${collapsed['observaciones'] ? ' collapsed' : ''}`}>
            <div className="form-section-header flex items-center justify-between px-5 py-3.5 border-b border-gray-100 cursor-pointer hover:bg-gray-50 rounded-t-xl" onClick={() => toggleSection('observaciones')}>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <Pencil className="w-4 h-4 text-gray-500" /> Observaciones generales
                <CharCounter current={observaciones.length} max={OBS_MAX} />
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 chevron-icon" />
            </div>
            <div className="form-section-body p-5">
              <textarea
                value={observaciones}
                onChange={e => { if (e.target.value.length <= OBS_MAX) setObservaciones(e.target.value); }}
                maxLength={OBS_MAX}
                placeholder="Notas especiales, indicaciones para el equipo de producción…"
                className={`w-full min-h-20 p-3 bg-white border rounded-lg text-sm text-gray-800 resize-y outline-none focus:border-gray-400 font-sans ${step1Touched && step1Errors.observaciones ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
              />
              {step1Touched && <FieldError msg={step1Errors.observaciones} />}
              <div className="text-xs text-gray-400 mt-1">{observaciones.length}/{OBS_MAX} caracteres</div>
            </div>
          </div>

          <div className="form-nav">
            <div></div>
            <button
              onClick={handleGoStep2}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${step1Touched && step1HasErrors
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#050314] text-white hover:bg-gray-800'
                }`}
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {step1Touched && step1HasErrors && (
            <div className="flex items-center gap-2 mt-2 text-xs text-red-600 justify-end">
              <AlertCircle className="w-3.5 h-3.5" />
              Completa los campos obligatorios antes de continuar
            </div>
          )}
        </div>
      )}

      {/* ── STEP 2: PRENDAS ── */}
      {substepActual === 2 && (
        <div>
          <div className="bg-white border border-gray-200 rounded-xl mb-4">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <Shirt className="w-4 h-4 text-gray-500" /> Prendas y cantidades
              </div>
            </div>
            <div className="p-5">
              <PrendasEditor
                clothesData={clothesData}
                onChange={setClothesData}
                tiposDisponibles={prendasSeleccionadas}
              />
            </div>
          </div>
          <div className="form-nav">
            <button onClick={() => onGoSubstep(1)} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>
            <div className="flex flex-col items-end gap-1">
              <button
                onClick={() => {
                  if (clothesData.length === 0) {
                    onShowAlert('Sin prendas', 'Agrega al menos una prenda antes de continuar.', 'shirt');
                    return;
                  }
                  onGoSubstep(3);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#050314] text-white rounded-lg hover:bg-gray-800"
              >
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
              {clothesData.length === 0 && (
                <div className="text-xs text-amber-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Debes agregar al menos una prenda
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 3: ÁREAS ── */}
      {substepActual === 3 && (
        <div>
          {/* Info banner */}
          <div className="flex flex-row items-start    gap-3 px-4 py-3 mb-4 bg-amber-50 border border-amber-200 rounded-xl">
            <TriangleAlert className="w-4 my-auto md:mt-3 lg:my-auto justify-center h-4 text-amber-600 flex-shrink-0 mt-0.5 " />
            <p className="text-xs my-auto justify-center text-amber-700 leading-relaxed">Activa las áreas que participarán en la producción de esta orden. Puedes agregar actividades específicas a cada área activa.</p>
          </div>



          {areasActivas && (
            <>
              {/* ── Desktop (lg+): original toggle-switch form ── 
              <div className="hidden lg:block">
                <AreasForm
                  areasActivas={areasActivas}
                  onToggleArea={onToggleArea}
                  onQuitarActividad={onQuitarActividad}
                  onAbrirModalActividades={onAbrirModalActividades}
                  onSelectTagOp={onSelectTagOp}
                  onToggleMulti={onToggleMulti}
                  onTextChange={onTextChange}
                  onCustomOtroToggle={onCustomOtroToggle}
                  onCustomOtroChange={onCustomOtroChange}
                  tpuAlert={tpuAlert}
                />
              </div>*/}

              {/* ── Mobile/tablet (<lg): card-based two-view flow ── */}
              <div className="block">
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
                  tpuAlert={tpuAlert}
                />
              </div>
            </>
          )}

          {/* Step nav — hidden on mobile when the area panel is open */}
          {/* Step nav — oculto cuando el panel de agregar/editar actividades está abierto */}
          {mobileAreasView !== 'panel' && (
            <div className="form-nav">
              <button onClick={() => onGoSubstep(2)} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>
              <button
                onClick={() => {
                  const tieneAreas = (areasActivas || []).some((a: any) => a.activa);
                  if (!tieneAreas) {
                    onShowAlert('Áreas requeridas', 'Debes seleccionar al menos un área para continuar con el flujo de producción.', 'alert-circle');
                    return;
                  }
                  onGoSubstep(4);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#050314] text-white rounded-lg hover:bg-gray-800"
              >
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}


        </div>
      )}

      {/* ── STEP 4: SECUENCIA ── */}
      {substepActual === 4 && (
        <SecuenciaStep areasActivas={areasActivas} areasSecuencia={areasSecuencia} setAreasSecuencia={setAreasSecuencia} onGoSubstep={onGoSubstep} />
      )}

      {/* ── STEP 5: RESUMEN ── */}
      {substepActual === 5 && (
        <div>
          <ResumenView
            disciplina={disciplina} categoria={categoria} tipoSolicitud={tipoSolicitud}
            observaciones={observaciones} tipoDiseno={tipoDiseno}
            prendasSeleccionadas={prendasSeleccionadas} clothesData={clothesData}
            adjuntosData={adjuntosData} areasActivas={areasActivas}
            areasSecuencia={areasSecuencia} pedidoActivo={pedidoActivo}
          />
          <div className="form-nav">
            <button onClick={() => onGoSubstep(4)} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <ChevronLeft className="w-4 h-4" /> Editar
            </button>
            <button onClick={onConfirmarOrden} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#050314] text-white rounded-lg hover:bg-gray-800">
              <CheckCircle className="w-4 h-4" /> Confirmar orden
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
