import { useState } from 'react';
import { Search, X, AlertTriangle, Clock, CheckCircle, XCircle, ArrowRight, ClipboardList } from 'lucide-react';
import { getAreasAsignadas, formatAreasLabel } from '../../utils/incidencias';

/** Normalizes any raw incidencia (Empleado or Admin format) into canonical form */
export function normalizarIncidencia(raw) {
  const areas = getAreasAsignadas(raw);
  let estado = 'activa';
  if (raw.estado === 'rechazada') estado = 'rechazada';
  else if (raw.resuelta || raw.estado === 'resuelta') estado = 'resuelta';
  else if (raw.estado === 'pendiente') estado = 'activa';
  else if (raw.estado === 'aceptada') estado = 'activa';

  return {
    id: raw.id || '—',
    pedidoId: raw.pedido || raw.pedidoId || '—',
    ordenId: raw.orden || raw.ordenAfectada || raw.ordenId || '—',
    equipo: raw.equipo || '',
    areaOrigen: raw.areaReporta || raw.areaOrigen || '—',
    areaResponsable: formatAreasLabel(areas),
    areasAsignadas: areas,
    personaValida: raw.personaValida || '',
    severidad: raw.severidad || 'Media',
    descripcion: raw.desc || raw.descripcionFalla || '',
    accionSugerida: raw.acciones || raw.accionInmediata || '',
    estado,
    fechaCreacion: raw.fecha || raw.fechaCreacion || '',
    fechaResolucion: raw.fechaResolucion,
  };
}

// ── Severity helpers ──────────────────────────────────────────────────────────
const SEV_COLOR = {
  Alta: '#ef4444',
  Media: '#f97316',
  Baja: '#3b82f6',
};
const SEV_BADGE = {
  Alta: 'bg-red-50 text-red-700 border border-red-200',
  Media: 'bg-orange-50 text-orange-700 border border-orange-100',
  Baja: 'bg-blue-50 text-blue-700 border border-blue-100',
};

// ── Estado helpers ────────────────────────────────────────────────────────────
const ESTADO_LABEL = {
  activa: 'Activa',
  pendiente: 'Activa',
  en_proceso: 'En proceso',
  aceptada: 'Activa',
  resuelta: 'Resuelta',
  rechazada: 'Rechazada',
};
const ESTADO_BADGE = {
  activa: 'bg-blue-50 text-blue-700 border border-blue-100',
  pendiente: 'bg-blue-50 text-blue-700 border border-blue-100',
  en_proceso: 'bg-blue-50 text-blue-700 border border-blue-100',
  aceptada: 'bg-blue-50 text-blue-700 border border-blue-100',
  resuelta: 'bg-green-50 text-green-700 border border-green-200',
  rechazada: 'bg-gray-100 text-gray-600 border border-gray-200',
};
const ESTADO_ICON = {
  activa: <Clock className="w-3 h-3" />,
  pendiente: <Clock className="w-3 h-3" />,
  aceptada: <Clock className="w-3 h-3" />,
  en_proceso: <Clock className="w-3 h-3" />,
  resuelta: <CheckCircle className="w-3 h-3" />,
  rechazada: <XCircle className="w-3 h-3" />,
};

// ── Detail modal ──────────────────────────────────────────────────────────────
function IncidenciaDetailModal({ inc, onClose }) {
  return (
    <div
      className="modal-overlay visible"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-box bg-white border border-gray-200 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-sm font-bold text-gray-900">{inc.id}</span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${SEV_BADGE[inc.severidad]}`}>
                <AlertTriangle className="w-3 h-3" />
                {inc.severidad}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${ESTADO_BADGE[inc.estado] || ESTADO_BADGE.pendiente}`}>
                {ESTADO_ICON[inc.estado]}
                {ESTADO_LABEL[inc.estado] || inc.estado}
              </span>
            </div>
            <div className="text-xs text-gray-400">
              {inc.fechaCreacion && `Reportada: ${inc.fechaCreacion}`}
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg ml-3 flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Read-only badge */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-500">
            <span className="inline-block w-2 h-2 rounded-full bg-gray-400 flex-shrink-0"></span>
            Vista de solo lectura — el Gestor puede consultar pero no modificar las incidencias.
          </div>

          {/* Trazabilidad */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-indigo-500 mb-3">Trazabilidad</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-gray-400 mb-0.5">Pedido</div>
                <span className="font-mono text-sm font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">{inc.pedidoId}</span>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-0.5">Orden afectada</div>
                <span className="font-mono text-sm font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">{inc.ordenId}</span>
              </div>
              {inc.equipo && (
                <div className="col-span-2">
                  <div className="text-xs text-gray-400 mb-0.5">Cliente / Equipo</div>
                  <div className="text-sm font-medium text-gray-800">{inc.equipo}</div>
                </div>
              )}
            </div>
          </div>

          {/* Areas */}
          <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl">
            <div className="flex-1 text-center">
              <div className="text-xs text-gray-400 mb-1">Área que reporta</div>
              <div className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                {inc.areaOrigen}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
            <div className="flex-1 text-center">
              <div className="text-xs text-gray-400 mb-1">Áreas asignadas</div>
              <div className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-orange-50 text-orange-700 border border-orange-100">
                {inc.areaResponsable}
              </div>
            </div>
          </div>

          {inc.personaValida && (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm">
              <span className="text-xs text-gray-400 block mb-0.5">Persona que valida</span>
              <span className="font-medium text-gray-800">{inc.personaValida}</span>
            </div>
          )}

          {/* Descripción */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Descripción de la falla</div>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {inc.descripcion || <span className="text-gray-400 italic">Sin descripción</span>}
            </div>
          </div>

          {/* Acción sugerida */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Acción inmediata sugerida</div>
            <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl text-sm text-yellow-800 leading-relaxed italic">
              {inc.accionSugerida || <span className="text-gray-400">Sin acción registrada</span>}
            </div>
          </div>

          {inc.fechaResolucion && (
            <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
              Resuelta el: {new Date(inc.fechaResolucion).toLocaleString('es-MX')}
            </div>
          )}
        </div>

        <div className="flex justify-end px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Incidencia card ───────────────────────────────────────────────────────────
function IncidenciaCard({ inc, onClick }) {
  const sevColor = SEV_COLOR[inc.severidad] || '#6b7280';
  return (
    <div
      className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-2.5 cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all"
      style={{ borderLeft: `3.5px solid ${sevColor}` }}
      onClick={onClick}
    >
      <div className="px-4 py-3 flex items-start gap-3">
        {/* Left: ID + tags */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="font-mono text-xs font-bold text-gray-700">{inc.id}</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${SEV_BADGE[inc.severidad]}`}>
              <AlertTriangle className="w-2.5 h-2.5" />
              {inc.severidad}
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${ESTADO_BADGE[inc.estado] || ESTADO_BADGE.pendiente}`}>
              {ESTADO_ICON[inc.estado]}
              {ESTADO_LABEL[inc.estado] || inc.estado}
            </span>
          </div>

          {/* Pedido / Orden */}
          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            <span className="inline-flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-mono font-semibold border border-indigo-100">
              <ClipboardList className="w-3 h-3" />
              {inc.pedidoId}
            </span>
            <span className="text-gray-300 text-xs">›</span>
            <span className="text-xs text-gray-500 font-mono">{inc.ordenId}</span>
          </div>

          {/* Area flow */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
            <span className="font-medium text-blue-600">{inc.areaOrigen}</span>
            <ArrowRight className="w-3 h-3 text-gray-300" />
            <span className="font-medium text-orange-600">{inc.areaResponsable}</span>
          </div>

          {/* Description preview */}
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {inc.descripcion || <span className="italic">Sin descripción</span>}
          </p>
        </div>

        {/* Right: date */}
        <div className="flex-shrink-0 text-xs text-gray-400 text-right pt-0.5">
          {inc.fechaCreacion}
        </div>
      </div>
    </div>
  );
}

export default function IncidenciasGestorScreen({ incidencias }) {
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [detalle, setDetalle] = useState(null);

  // Normalize all raw incidencias to canonical form
  const normalized = incidencias.map(normalizarIncidencia);

  // Counts per status
  const conteo = {
    todos: normalized.length,
    pendiente: normalized.filter(i => i.estado === 'pendiente').length,
    en_proceso: normalized.filter(i => i.estado === 'en_proceso').length,
    resuelta: normalized.filter(i => i.estado === 'resuelta').length,
    rechazada: normalized.filter(i => i.estado === 'rechazada').length,
  };

  // Filter
  const filtered = normalized.filter(inc => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || inc.pedidoId.toLowerCase().includes(q)
      || inc.ordenId.toLowerCase().includes(q)
      || inc.areaOrigen.toLowerCase().includes(q)
      || inc.areaResponsable.toLowerCase().includes(q)
      || inc.descripcion.toLowerCase().includes(q)
      || inc.equipo.toLowerCase().includes(q);
    const matchEstado = filtroEstado === 'todos' || inc.estado === filtroEstado;
    return matchSearch && matchEstado;
  });

  const filterButtons = [
    { key: 'todos', label: 'Todas' },
    { key: 'pendiente', label: 'Pendientes' },
    { key: 'en_proceso', label: 'En proceso' },
    { key: 'resuelta', label: 'Resueltas' },
    { key: 'rechazada', label: 'Rechazadas' },
  ].filter(f => f.key === 'todos' || conteo[f.key] > 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Incidencias</h1>
          <p className="text-sm text-gray-500 mt-1">
            Seguimiento de reportes de fallas en órdenes de producción · Solo lectura
          </p>
        </div>
        {conteo.pendiente > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs font-semibold text-amber-700">
            <Clock className="w-4 h-4" />
            {conteo.pendiente} pendiente{conteo.pendiente !== 1 ? 's' : ''} sin resolver
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por pedido, orden, área…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status filter pills */}
        <div className="flex flex-wrap gap-1.5">
          {filterButtons.map(f => {
            const isActive = filtroEstado === f.key;
            const badgeCls = f.key === 'todos'
              ? (isActive ? 'bg-gray-950 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400')
              : f.key === 'pendiente'
              ? (isActive ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-amber-600 border-amber-200 hover:border-amber-400')
              : f.key === 'en_proceso'
              ? (isActive ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-blue-600 border-blue-200 hover:border-blue-400')
              : f.key === 'resuelta'
              ? (isActive ? 'bg-green-600 text-white border-green-600' : 'bg-white text-green-700 border-green-200 hover:border-green-400')
              : (isActive ? 'bg-gray-600 text-white border-gray-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400');
            return (
              <button
                key={f.key}
                onClick={() => setFiltroEstado(f.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${badgeCls}`}
              >
                {f.label}
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isActive ? 'bg-white/20' : 'bg-gray-100 text-gray-600'}`}>
                  {conteo[f.key]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      {normalized.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-gray-200 rounded-xl">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-4">
            <CheckCircle className="w-7 h-7 text-green-500" />
          </div>
          <div className="text-sm font-semibold text-gray-700 mb-1">Sin incidencias registradas</div>
          <div className="text-xs text-gray-400 max-w-xs">
            Cuando los empleados de área reporten fallas de producción, aparecerán aquí para su seguimiento.
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-gray-200 rounded-xl">
          <Search className="w-8 h-8 text-gray-300 mb-3" />
          <div className="text-sm text-gray-500">
            No se encontraron incidencias con estos filtros.
          </div>
          <button
            onClick={() => { setSearch(''); setFiltroEstado('todos'); }}
            className="mt-3 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div>
          <div className="text-xs text-gray-400 mb-3">
            Mostrando {filtered.length} de {normalized.length} incidencia{normalized.length !== 1 ? 's' : ''}
          </div>
          {filtered.map(inc => (
            <IncidenciaCard key={inc.id} inc={inc} onClick={() => setDetalle(inc)} />
          ))}
        </div>
      )}

      {/* Detail modal */}
      {detalle && (
        <IncidenciaDetailModal inc={detalle} onClose={() => setDetalle(null)} />
      )}
    </div>
  );
}
