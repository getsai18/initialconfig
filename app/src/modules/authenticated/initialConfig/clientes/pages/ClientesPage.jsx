import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Search, Users, UserCircle, X, ClipboardList, Package, ChevronDown, ChevronUp } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Pagination } from '@/kernel/components/Pagination'
import { SuccessModal } from '@/kernel/components/SuccessModal'
import { useEscapeToClose } from '@/kernel/hooks/useEscapeToClose'
import { useClientes } from '../hooks/useClientes'
import ClientesService from '../services/ClientesService'
import Loading from '@/kernel/components/Loading'

const estadoOrdenConfig = {
  completado: { label: 'Completado', color: 'bg-green-100 text-green-700' },
  'en-progreso': { label: 'En progreso', color: 'bg-blue-100 text-blue-700' },
  pendiente: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
  cancelado: { label: 'Cancelado', color: 'bg-red-100 text-red-700' },
}

const PAGE_SIZE = 10

export function ClientesPage({ isSubAdmin }) {
  const {
    clientes, createCliente, updateCliente, removeCliente,
    page, setPage, search, setSearch, pageItems, totalElements, totalPages,
    pageLoading,
  } = useClientes()

  const [filterTipo, setFilterTipo] = useState('todos')
  const [modalOpen, setModalOpen] = useState(false)
  const [isView, setIsView] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [historialCliente, setHistorialCliente] = useState(null)
  const [historialPage, setHistorialPage] = useState(1)

  const [successModal, setSuccessModal] = useState(null)
  const [editSuccessModal, setEditSuccessModal] = useState(null)

  // Estados de carga de peticiones
  const [isSaving, setIsSaving] = useState(false)
  const [savingMessage, setSavingMessage] = useState('Guardando...')

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ defaultValues: { tipo: 'individual' } })

  useEscapeToClose([
    [successModal, () => setSuccessModal(null)],
    [editSuccessModal, () => setEditSuccessModal(null)],
    [deleteModal, () => setDeleteModal(null)],
    [modalOpen, () => setModalOpen(false)],
    [historialCliente, () => setHistorialCliente(null)],
  ])

  const [historialOrdenes, setHistorialOrdenes] = useState([])
  const [expandedOrdenId, setExpandedOrdenId] = useState(null)
  useEffect(() => {
    if (!historialCliente) { setHistorialOrdenes([]); setExpandedOrdenId(null); return }
    ClientesService.getHistorial(historialCliente.id)
      .then(data => setHistorialOrdenes(Array.isArray(data) ? data : []))
      .catch(() => setHistorialOrdenes([]))
  }, [historialCliente])
  const HIST_PAGE_SIZE = 5
  const historialTotalPages = Math.max(1, Math.ceil(historialOrdenes.length / HIST_PAGE_SIZE))
  const historialPaginated = historialOrdenes.slice((historialPage - 1) * HIST_PAGE_SIZE, historialPage * HIST_PAGE_SIZE)

  function openCreate() {
    setIsView(false)
    reset({ nombre: '', vendor: '', informacion: '' })
    setEditTarget(null)
    setModalOpen(true)
  }

  function openEdit(c, e) {
    if (e) e.stopPropagation()
    setIsView(false)
    reset({
      nombre: c.nombre,
      vendor: c.vendor || '',
      informacion: c.informacion || ''
    })
    setEditTarget(c)
    setModalOpen(true)
  }

  function openView(c) {
    setIsView(true)
    reset({
      nombre: c.nombre,
      vendor: c.vendor || '',
      informacion: c.informacion || ''
    })
    setEditTarget(c)
    setModalOpen(true)
  }

  async function onSubmit(data) {
    if (isView) return

    setSavingMessage(editTarget ? 'Actualizando cliente...' : 'Creando cliente...')
    setIsSaving(true)
    try {
      if (editTarget) {
        await updateCliente(editTarget.id, { nombre: data.nombre, vendor: data.vendor, informacion: data.informacion })
        setModalOpen(false)
        setEditSuccessModal(data)
      } else {
        const nuevo = await createCliente({ nombre: data.nombre, vendor: data.vendor, informacion: data.informacion })
        setSuccessModal(nuevo)
        setModalOpen(false)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSaving(false)
    }
  }

  async function confirmDelete() {
    if (!deleteModal) return
    setSavingMessage('Eliminando cliente...')
    setIsSaving(true)
    try {
      await removeCliente(deleteModal.id)
    } catch (e) {
      console.error(e)
    } finally {
      setIsSaving(false)
      setDeleteModal(null)
    }
  }

  return (
    <div className="p-8 relative">
      {isSaving && <Loading overlay message={savingMessage} />}
      <div className="mb-6">
        <h1 className ="font-bold">Clientes</h1>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Buscar equipo o representante..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <button onClick={() => console.log('Texto')} className='flex items-center mr-auto px-4 py-2 rounded-lg bg-transparent border border-primary text-transparent-foreground hover:opacity-75 transition-opacity'>
            <Search className="w-5 h-5" />
          </button>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Nuevo Cliente
        </button>
      </div>

      <div className="border border-border rounded-xl overflow-x-auto bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 text-muted-foreground">#</th>
              <th className="text-left px-4 py-3 text-muted-foreground">Nombre</th>
              <th className="text-left px-4 py-3 text-muted-foreground">Representante</th>
              <th className="text-left px-4 py-3 text-muted-foreground">Información</th>
              <th className="text-left px-4 py-3 text-muted-foreground">Registro</th>
              <th className="text-left px-4 py-3 text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pageLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10">
                  <Loading message="Cargando clientes..." />
                </td>
              </tr>
            ) : pageItems.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">No se encontraron clientes</td></tr>
            ) : (
              pageItems.map((c, idx) => (
                <tr key={c.id} title='Click para ver infomración' onClick={() => openView(c)} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer">
                  <td className="px-4 py-3 text-muted-foreground">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 font-bold">
                      <span>{c.nombre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{c.vendor}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-xs">{c.informacion ? <span className="truncate block">{c.informacion}</span> : <span className="text-muted-foreground/50">—</span>}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.fechaRegistro}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={(e) => { e.stopPropagation(); setHistorialCliente(c); setHistorialPage(1) }} className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" title="Historial"><ClipboardList className="w-4 h-4" /></button>
                      <button onClick={(e) => openEdit(c, e)} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" title="Editar"><Pencil className="w-4 h-4" /></button>
                      {!isSubAdmin && (
                        <button onClick={(e) => { e.stopPropagation(); setDeleteModal(c) }} className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPage={setPage} totalItems={totalElements} pageSize={PAGE_SIZE} />

      {historialCliente && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${historialCliente.tipo === 'equipo' ? 'bg-orange-100' : 'bg-blue-100'}`}>
                  {historialCliente.tipo === 'equipo' ? <Users className="w-5 h-5 text-orange-600" /> : <UserCircle className="w-5 h-5 text-blue-600" />}
                </div>
                <div>
                  <h2>{historialCliente.nombre}</h2>
                  <p className="text-sm text-muted-foreground">Historial de pedidos — {historialOrdenes.length} {historialOrdenes.length === 1 ? 'orden' : 'órdenes'}</p>
                </div>
              </div>
              <button onClick={() => setHistorialCliente(null)} className="p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              {historialOrdenes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Package className="w-12 h-12 text-muted-foreground/40 mb-3" />
                  <p className="text-muted-foreground">Sin pedidos registrados</p>
                </div>
              ) : (
                <>
                  <div className="border border-border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 border-b border-border">
                        <tr>
                          <th className="text-left px-4 py-3 text-muted-foreground">ID de Orden</th>
                          <th className="text-left px-4 py-3 text-muted-foreground">Descripción</th>
                          <th className="text-left px-4 py-3 text-muted-foreground">Fecha</th>
                          <th className="text-left px-4 py-3 text-muted-foreground">Entrega</th>
                          <th className="text-left px-4 py-3 text-muted-foreground">Estado / Avance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historialPaginated.map(o => (
                          <>
                            <tr key={o.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                              <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                              <td className="px-4 py-3 text-muted-foreground max-w-xs">{o.descripcion}</td>
                              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{o.fecha}</td>
                              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{o.entrega}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs ${estadoOrdenConfig[o.estado].color}`}>
                                    {estadoOrdenConfig[o.estado].label} {o.estado === 'en-progreso' && `(${o.progreso || 0}%)`}
                                  </span>
                                  {o.areas?.length > 0 && (
                                    <button
                                      onClick={() => setExpandedOrdenId(prev => prev === o.id ? null : o.id)}
                                      className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                                      title="Ver avance por área"
                                    >
                                      {expandedOrdenId === o.id
                                        ? <ChevronUp className="w-3.5 h-3.5" />
                                        : <ChevronDown className="w-3.5 h-3.5" />
                                      }
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                            {expandedOrdenId === o.id && o.areas?.length > 0 && (
                              <tr key={`${o.id}-avance`} className="border-b border-border">
                                <td colSpan={5} className="px-4 pb-4 pt-1 bg-muted/20">
                                  <div className="p-3 rounded-lg border border-border bg-card">
                                    <div className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                                      Avance por área — {o.id}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {o.areas.map(ar => {
                                        const isAreaConfirmed = ar.isAreaConfirmed;
                                        const pct = ar.total ? (ar.done === ar.total && !isAreaConfirmed ? 99 : Math.round(ar.done / ar.total * 100)) : 0;
                                        const isDone = ar.done === ar.total && isAreaConfirmed;
                                        const isStarted = ar.done > 0 && !isDone;
                                        const showWaitingEntrega = ar.done === ar.total && !isAreaConfirmed;

                                        return (
                                          <div key={ar.nombre} className="flex-1 min-w-[140px] max-w-[220px] p-2.5 rounded-lg border border-border bg-background">
                                            <div className="flex items-center gap-1.5 mb-2">
                                              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: ar.color }} />
                                              <span className="text-xs font-medium truncate flex-1">{ar.nombre}</span>
                                              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold shrink-0 ${
                                                isDone
                                                  ? 'bg-green-100 text-green-700'
                                                  : showWaitingEntrega
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : isStarted
                                                      ? 'bg-blue-100 text-blue-700'
                                                      : 'bg-muted text-muted-foreground'
                                              }`}>
                                                {isDone ? '✓' : `${ar.done}/${ar.total}`}
                                              </span>
                                            </div>
                                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                              <div
                                                className="h-full rounded-full transition-all duration-300"
                                                style={{ width: `${pct}%`, background: ar.color }}
                                              />
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                              {isDone
                                                ? 'Completado'
                                                : showWaitingEntrega
                                                  ? 'Esperando entrega'
                                                  : isStarted
                                                    ? 'En proceso'
                                                    : 'Pendiente'
                                              }
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination page={historialPage} totalPages={historialTotalPages} onPage={setHistorialPage} totalItems={historialOrdenes.length} pageSize={HIST_PAGE_SIZE} />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><UserCircle className="w-5 h-5 text-primary" /></div>
              <div>
                <h2>{isView ? 'Detalles del Cliente' : editTarget ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
                <p className="text-sm text-muted-foreground">{isView ? 'Vista de solo lectura' : editTarget ? 'Modifica los datos del cliente' : 'Registra un nuevo cliente o equipo'}</p>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nombre del equipo *</label>
                <input
                  disabled={isView}
                  {...register('nombre', { required: 'El nombre es obligatorio' })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring lowercase"

                  placeholder="Ej. Los Tigres"
                />
                {errors.nombre && <span className="text-xs text-destructive">{errors.nombre.message}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Representante</label>
                <input
                  disabled={isView}
                  {...register('vendor')}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring lowercase"
                  placeholder="Nombre del representante"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Información adicional</label>
                <textarea maxLength='300'
                  disabled={isView}
                  {...register('informacion')}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring lowercase"
                  placeholder="Detalles extra del equipo..."
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-2">
                {isView ? (
                  <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity">Cerrar</button>
                ) : (
                  <>
                    <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent transition-colors">Cancelar</button>
                    <button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity">{editTarget ? 'Guardar Cambios' : 'Registrar Cliente'}</button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
      <SuccessModal
        isOpen={!!successModal}
        onClose={() => setSuccessModal(null)}
        title="¡Cliente Registrado!"
        message={
          <>
            El cliente <strong>{successModal?.nombre}</strong> se ha registrado correctamente en el sistema.
          </>
        }
      />

      <SuccessModal
        isOpen={!!editSuccessModal}
        onClose={() => setEditSuccessModal(null)}
        title="¡Cliente Actualizado!"
        message={
          <>
            Los datos del cliente <strong>{editSuccessModal?.nombre}</strong> se han actualizado correctamente.
          </>
        }
      />

      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-sm mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6 text-destructive" /></div>
            <h2 className="text-center mb-2">Eliminar Cliente</h2>
            <p className="text-center text-sm text-muted-foreground mb-6">¿Estás seguro de eliminar a <strong>{deleteModal.nombre}</strong>? Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(null)} className="flex-1 px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent transition-colors">Cancelar</button>
              <button onClick={confirmDelete} className="flex-1 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm hover:opacity-90 transition-opacity">Eliminar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
