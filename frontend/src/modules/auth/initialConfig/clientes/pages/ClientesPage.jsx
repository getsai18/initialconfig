import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Search, UserCircle, X, ClipboardList, Package } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Pagination } from '@/kernel/components/Pagination'
import { useEscapeToClose } from '@/kernel/hooks/useEscapeToClose'
import { useClientes } from '../hooks/useClientes'
import ClientesService from '../services/ClientesService'
import Loading from '@/kernel/components/Loading'
import toast from 'react-hot-toast'

// Debe calzar con Pedido.status real del backend (EN_PROGRESO/EN_PRODUCCION/TERMINADO).
const estadoPedidoConfig = {
  'En progreso': { label: 'En progreso', color: 'bg-blue-100 text-blue-700' },
  'En producción': { label: 'En producción', color: 'bg-yellow-100 text-yellow-700' },
  Terminado: { label: 'Terminado', color: 'bg-green-100 text-green-700' },
}
const DEFAULT_ESTADO_PEDIDO = { label: '—', color: 'bg-gray-100 text-gray-600' }

const PAGE_SIZE = 10

export function ClientesPage({ isSubAdmin }) {
  const {
    createCliente, updateCliente, removeCliente,
    page, setPage, search, setSearch, pageItems, totalElements, totalPages,
    pageLoading,
  } = useClientes()

  const [modalOpen, setModalOpen] = useState(false)
  const [isView, setIsView] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [historialCliente, setHistorialCliente] = useState(null)
  const [historialPage, setHistorialPage] = useState(1)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEscapeToClose([
    [deleteModal, () => setDeleteModal(null)],
    [modalOpen, () => setModalOpen(false)],
    [historialCliente, () => setHistorialCliente(null)],
  ])

  const [historialOrdenes, setHistorialOrdenes] = useState([])
  useEffect(() => {
    if (!historialCliente) { setHistorialOrdenes([]); return }
    // GET /clientes/{id}/historial devuelve un Page<PedidoResponse> (PageResponse), no un array plano.
    ClientesService.getHistorial(historialCliente.id)
      .then(data => setHistorialOrdenes(Array.isArray(data?.content) ? data.content : []))
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

    setModalOpen(false)

    const promise = editTarget
      ? updateCliente(editTarget.id, { nombre: data.nombre, vendor: data.vendor, informacion: data.informacion })
      : createCliente({ nombre: data.nombre, vendor: data.vendor, informacion: data.informacion })

    toast.promise(promise, {
      loading: editTarget ? 'Actualizando cliente...' : 'Creando cliente...',
      success: editTarget ? '¡Cliente actualizado con éxito!' : '¡Cliente registrado con éxito!',
      error: (err) => err.message || 'Ocurrió un error. Intenta nuevamente.'
    })
  }

  async function confirmDelete() {
    if (!deleteModal) return
    const target = deleteModal
    setDeleteModal(null)

    const promise = removeCliente(target.id)

    toast.promise(promise, {
      loading: 'Eliminando cliente...',
      success: '¡Cliente eliminado con éxito!',
      error: (err) => err.message || 'No se pudo eliminar el cliente.'
    })

  }

  return (
    <div className="p-8 relative max-w-6xl mx-auto w-full">
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
              <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">No hay clientes registrados</td></tr>
            ) : (
              pageItems.map((c, idx) => (
                <tr key={c.id} title='Click para ver infomración' onClick={() => openView(c)} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer">
                  <td className="px-4 py-3 text-muted-foreground">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                  <td className="px-4 py-3 break-words max-w-[200px] font-bold">
                    {c.nombre}
                  </td>
                  <td className="px-4 py-3 break-words max-w-[200px]">{c.vendor}</td>
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
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-100">
                  <UserCircle className="w-5 h-5 text-blue-600" />
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
                          <th className="text-left px-4 py-3 text-muted-foreground">ID de Pedido</th>
                          <th className="text-left px-4 py-3 text-muted-foreground">Fecha</th>
                          <th className="text-left px-4 py-3 text-muted-foreground">Fecha límite</th>
                          <th className="text-left px-4 py-3 text-muted-foreground">Órdenes / Kits</th>
                          <th className="text-left px-4 py-3 text-muted-foreground">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historialPaginated.map(p => {
                          const cfg = estadoPedidoConfig[p.status] || DEFAULT_ESTADO_PEDIDO
                          return (
                            <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                              <td className="px-4 py-3 font-mono text-xs">{p.id}</td>
                              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{p.fecha}</td>
                              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{p.fechaLimite || '—'}</td>
                              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{p.totalOrdenes} / {p.totalKits}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs ${cfg.color}`}>{cfg.label}</span>
                                  {p.vencido && (
                                    <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700">Vencido</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        })}
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
                  maxLength={50}
                  {...register('nombre', { required: 'El nombre es obligatorio', maxLength: { value: 50, message: 'Máximo 50 caracteres' } })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Ej. Los Tigres"
                />
                {errors.nombre && <span className="text-xs text-destructive">{errors.nombre.message}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Representante *</label>
                <input
                  disabled={isView}
                  maxLength={50}
                  {...register('vendor', { required: 'El representante es obligatorio', maxLength: { value: 50, message: 'Máximo 50 caracteres' } })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Nombre del representante"
                />
                {errors.vendor && <span className="text-xs text-destructive">{errors.vendor.message}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Información adicional</label>
                <textarea 
                  maxLength={500}
                  disabled={isView}
                  {...register('informacion', { maxLength: { value: 500, message: 'Máximo 500 caracteres' } })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
