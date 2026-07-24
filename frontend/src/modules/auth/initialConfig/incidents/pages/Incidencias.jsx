import { useState, useEffect } from 'react'
import { Search, Clock, Eye, AlertTriangle, Trash2 } from 'lucide-react'
import { Pagination } from '@/kernel/components/Pagination'
import { getAreasAsignadas, formatAreasLabel } from '../../utils/incidencias'
import { useAuth } from '@/kernel/context/AuthContext'
import IncidenciasService from '../services/IncidenciasService'

const PAGE_SIZE = 10

function field(inc, adminKey, empleadoKey) {
  return inc[adminKey] || inc[empleadoKey] || '—'
}

function estadoVisible(inc) {
  if (inc.resuelta || inc.estado === 'resuelta') return 'resuelta'
  if (inc.estado === 'rechazada') return 'rechazada'
  return 'activa'
}

export function Incidencias({ isSubAdmin: propIsSubAdmin, incidencias: externalIncidencias, setIncidencias: externalSetIncidencias } = {}) {
  const { isSubAdmin: authIsSubAdmin } = useAuth()
  const isSubAdmin = propIsSubAdmin !== undefined ? propIsSubAdmin : authIsSubAdmin

  const [localIncidencias, setLocalIncidencias] = useState([])
  const incidencias = externalIncidencias ?? localIncidencias
  const setIncidencias = externalSetIncidencias ?? setLocalIncidencias

  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [detalleModal, setDetalleModal] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [page, setPage] = useState(1)

  const usesExternalState = externalIncidencias !== undefined

  useEffect(() => {
    if (usesExternalState) return
    IncidenciasService.getAll()
      .then(res => {
        if (Array.isArray(res)) setLocalIncidencias(res)
        else if (res?.data && Array.isArray(res.data)) setLocalIncidencias(res.data)
      })
      .catch(console.warn)
  }, [usesExternalState])

  useEffect(() => {
    function onKey(e) {
      if (e.key !== 'Escape') return
      if (deleteTarget) { setDeleteTarget(null); return }
      if (detalleModal) setDetalleModal(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [detalleModal, deleteTarget])

  useEffect(() => { setPage(1) }, [search, filtroEstado])

  const eliminarIncidencia = (id) => {
    IncidenciasService.remove(id).catch(console.warn)
    setIncidencias(prev => prev.filter(inc => inc.id !== id))
    if (detalleModal?.id === id) setDetalleModal(null)
    setDeleteTarget(null)
  }

  const filtered = incidencias.filter(inc => {
    const q = search.toLowerCase()
    const areasStr = formatAreasLabel(getAreasAsignadas(inc)).toLowerCase()
    const cumpleBusqueda =
      inc.pedido?.toLowerCase().includes(q) ||
      inc.ordenAfectada?.toLowerCase().includes(q) ||
      inc.orden?.toLowerCase().includes(q) ||
      inc.areaOrigen?.toLowerCase().includes(q) ||
      inc.areaReporta?.toLowerCase().includes(q) ||
      inc.personaValida?.toLowerCase().includes(q) ||
      areasStr.includes(q)
    const estado = estadoVisible(inc)
    const cumpleFiltro = filtroEstado === 'todos' || estado === filtroEstado
    return cumpleBusqueda && cumpleFiltro
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const conteo = {
    todos: incidencias.length,
    activa: incidencias.filter(i => estadoVisible(i) === 'activa').length,
    resuelta: incidencias.filter(i => estadoVisible(i) === 'resuelta').length,
    rechazada: incidencias.filter(i => estadoVisible(i) === 'rechazada').length,
  }

  const badgeStyles = {
    activa: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    resuelta: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    rechazada: 'bg-destructive/10 text-destructive border-destructive/20',
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-bold">Gestión de Incidencias Internas</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Consulta {!isSubAdmin ? 'y elimina' : ''} incidencias. Las reposiciones se envían automáticamente a las áreas indicadas.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por pedido, orden, área o validador..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(conteo).map(tipo => (
            <button
              key={tipo}
              onClick={() => setFiltroEstado(tipo)}
              className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all capitalize ${
                filtroEstado === tipo
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:bg-accent'
              }`}
            >
              {tipo} ({conteo[tipo]})
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border rounded-xl">
          <AlertTriangle className="w-12 h-12 mb-4 text-muted-foreground opacity-40" />
          <p className="text-muted-foreground">No se encontraron incidencias bajo estos criterios</p>
        </div>
      ) : (
        <>
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground font-medium">
                  <tr>
                    <th className="p-4">Pedido / Orden</th>
                    <th className="p-4">Origen → Áreas asignadas</th>
                    <th className="p-4">Validador</th>
                    <th className="p-4">Falla reportada</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginated.map(inc => {
                    const estado = estadoVisible(inc)
                    const areasLabel = formatAreasLabel(getAreasAsignadas(inc))
                    return (
                      <tr key={inc.id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-4 whitespace-nowrap">
                          <div className="font-semibold">{field(inc, 'pedido', 'pedido')}</div>
                          <div className="text-xs text-muted-foreground">{field(inc, 'ordenAfectada', 'orden')}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-xs font-medium text-primary bg-primary/5 px-2 py-0.5 rounded-md inline-block mb-1">
                            {field(inc, 'areaOrigen', 'areaReporta')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ↳ Áreas: <span className="font-medium text-foreground">{areasLabel}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm whitespace-nowrap">
                          {inc.personaValida || <span className="text-muted-foreground italic">—</span>}
                        </td>
                        <td className="p-4 max-w-xs md:max-w-md truncate">
                          <div className="font-medium text-foreground">{field(inc, 'descripcionFalla', 'desc')}</div>
                          <div className="text-xs text-muted-foreground italic truncate">Acción: {field(inc, 'accionInmediata', 'acciones')}</div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${badgeStyles[estado] || badgeStyles.activa}`}>
                            {estado}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setDetalleModal(inc)}
                              title="Ver detalle completo"
                              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {!isSubAdmin && (
                              <button
                                onClick={() => setDeleteTarget(inc)}
                                title="Eliminar incidencia"
                                className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPage={setPage}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
          />
        </>
      )}

      {detalleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDetalleModal(null)}>
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-border pb-4 mb-4">
              <div>
                <h2 className="text-base font-bold">Detalle de Incidencia Interna</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Pedido: {field(detalleModal, 'pedido', 'pedido')}</p>
              </div>
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${badgeStyles[estadoVisible(detalleModal)] || badgeStyles.activa}`}>
                {estadoVisible(detalleModal)}
              </span>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-2 bg-muted/30 p-3 rounded-lg border border-border">
                <div>
                  <span className="text-xs text-muted-foreground block">Área de Origen</span>
                  <span className="font-medium">{field(detalleModal, 'areaOrigen', 'areaReporta')}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Áreas asignadas</span>
                  <span className="font-medium">{formatAreasLabel(getAreasAsignadas(detalleModal))}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Orden afectada</span>
                  <span className="font-medium font-mono">{field(detalleModal, 'ordenAfectada', 'orden')}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Persona que valida</span>
                  <span className="font-medium">{detalleModal.personaValida || '—'}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-muted-foreground font-semibold block mb-1">Descripción explícita de la falla</span>
                <div className="p-3 bg-input-background border border-border rounded-lg text-foreground whitespace-pre-wrap">
                  {field(detalleModal, 'descripcionFalla', 'desc')}
                </div>
              </div>

              <div>
                <span className="text-xs text-muted-foreground font-semibold block mb-1">Acción inmediata requerida</span>
                <div className="p-3 bg-input-background border border-border rounded-lg text-foreground italic">
                  {field(detalleModal, 'accionInmediata', 'acciones')}
                </div>
              </div>

              {detalleModal.fechaResolucion && (
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 pt-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Resuelta el: {new Date(detalleModal.fechaResolucion).toLocaleString('es-MX')}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-6 mt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setDetalleModal(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent transition-colors"
              >
                Cerrar
              </button>
              {!isSubAdmin && (
                <button
                  onClick={() => { setDeleteTarget(detalleModal); setDetalleModal(null); }}
                  className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm hover:opacity-90 transition-opacity"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDeleteTarget(null)}>
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-sm mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-destructive" />
            </div>
            <h2 className="text-center mb-2">Eliminar incidencia</h2>
            <p className="text-center text-sm text-muted-foreground mb-6">
              ¿Eliminar la incidencia <strong>{deleteTarget.id}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent transition-colors">
                Cancelar
              </button>
              <button onClick={() => eliminarIncidencia(deleteTarget.id)} className="flex-1 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm hover:opacity-90 transition-opacity">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
