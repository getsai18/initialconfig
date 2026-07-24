import { useState } from 'react';
import { Search, X, AlertTriangle, Clock, CheckCircle, XCircle, ArrowRight, ClipboardList } from 'lucide-react';
import { getAreasAsignadas, formatAreasLabel } from '../../utils/incidencias';

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

const SEV_COLOR = {
  Alta: '#ef4444',
  Media: '#f97316',
  Baja: '#3b82f6',
};

const SEV_BADGE = {
  Alta: 'bg-destructive/10 text-destructive border border-destructive/20',
  Media: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
  Baja: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
};

const ESTADO_LABEL = {
  activa: 'Activa',
  pendiente: 'Activa',
  en_proceso: 'En proceso',
  aceptada: 'Activa',
  resuelta: 'Resuelta',
  rechazada: 'Rechazada',
};

const ESTADO_BADGE = {
  activa: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
  pendiente: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
  en_proceso: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
  aceptada: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
  resuelta: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
  rechazada: 'bg-muted text-muted-foreground border border-border',
};

const ESTADO_ICON = {
  activa: <Clock className="w-3 h-3" />,
  pendiente: <Clock className="w-3 h-3" />,
  aceptada: <Clock className="w-3 h-3" />,
  en_proceso: <Clock className="w-3 h-3" />,
  resuelta: <CheckCircle className="w-3 h-3" />,
  rechazada: <XCircle className="w-3 h-3" />,
};

function IncidenciaDetailModal({ inc, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] p-6">
        <div className="flex items-start justify-between pb-4 border-b border-border flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-sm font-bold text-foreground">{inc.id}</span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${SEV_BADGE[inc.severidad]}`}>
                <AlertTriangle className="w-3 h-3" />
                {inc.severidad}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${ESTADO_BADGE[inc.estado] || ESTADO_BADGE.pendiente}`}>
                {ESTADO_ICON[inc.estado]}
                {ESTADO_LABEL[inc.estado] || inc.estado}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {inc.fechaCreacion && `Reportada: ${inc.fechaCreacion}`}
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-sm">
          <div className="flex items-center gap-2 px-3 py-2 bg-muted/40 border border-border rounded-lg text-xs text-muted-foreground">
            Vista de solo lectura — el Gestor puede consultar las incidencias.
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-3">Trazabilidad</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">Pedido</div>
                <span className="font-mono text-sm font-bold text-primary">{inc.pedidoId}</span>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">Orden afectada</div>
                <span className="font-mono text-sm font-bold text-primary">{inc.ordenId}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Descripción de la falla</div>
            <div className="p-4 bg-input-background border border-border rounded-xl text-sm text-foreground whitespace-pre-wrap">
              {inc.descripcion || <span className="italic text-muted-foreground">Sin descripción</span>}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-accent">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function IncidenciaCard({ inc, onClick }) {
  const sevColor = SEV_COLOR[inc.severidad] || '#6b7280';
  return (
    <div
      className="bg-card border border-border rounded-xl overflow-hidden mb-2.5 cursor-pointer hover:border-accent transition-all p-4"
      style={{ borderLeft: `4px solid ${sevColor}` }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="font-mono text-xs font-bold text-foreground">{inc.id}</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${SEV_BADGE[inc.severidad]}`}>
              <AlertTriangle className="w-2.5 h-2.5" />
              {inc.severidad}
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${ESTADO_BADGE[inc.estado] || ESTADO_BADGE.pendiente}`}>
              {ESTADO_ICON[inc.estado]}
              {ESTADO_LABEL[inc.estado] || inc.estado}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            <span className="inline-flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded font-mono font-semibold">
              <ClipboardList className="w-3 h-3" />
              {inc.pedidoId}
            </span>
            <span className="text-muted-foreground text-xs">›</span>
            <span className="text-xs text-muted-foreground font-mono">{inc.ordenId}</span>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {inc.descripcion || <span className="italic">Sin descripción</span>}
          </p>
        </div>

        <div className="flex-shrink-0 text-xs text-muted-foreground text-right">
          {inc.fechaCreacion}
        </div>
      </div>
    </div>
  );
}

export default function IncidenciasGestorScreen({ incidencias = [] }) {
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [detalle, setDetalle] = useState(null);

  const normalized = incidencias.map(normalizarIncidencia);

  const filtered = normalized.filter(inc => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || inc.pedidoId.toLowerCase().includes(q)
      || inc.ordenId.toLowerCase().includes(q)
      || inc.areaOrigen.toLowerCase().includes(q)
      || inc.descripcion.toLowerCase().includes(q);
    const matchEstado = filtroEstado === 'todos' || inc.estado === filtroEstado;
    return matchSearch && matchEstado;
  });

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Incidencias</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Seguimiento de reportes de fallas en órdenes de producción · Solo lectura
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por pedido, orden, área…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-input-background outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-card border border-border rounded-xl">
          <CheckCircle className="w-8 h-8 text-muted-foreground/40 mb-3" />
          <div className="text-sm text-muted-foreground">No se encontraron incidencias</div>
        </div>
      ) : (
        <div>
          {filtered.map(inc => (
            <IncidenciaCard key={inc.id} inc={inc} onClick={() => setDetalle(inc)} />
          ))}
        </div>
      )}

      {detalle && (
        <IncidenciaDetailModal inc={detalle} onClose={() => setDetalle(null)} />
      )}
    </div>
  );
}
