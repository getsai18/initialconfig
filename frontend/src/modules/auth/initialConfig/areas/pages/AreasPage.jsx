import { useState } from 'react'
import { Plus, Pencil, Trash2, Search, Building2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Pagination } from '@/kernel/components/Pagination'
import { useEscapeToClose } from '@/kernel/hooks/useEscapeToClose'
import { useAreas } from '../hooks/useAreas'
import Loading from '@/kernel/components/Loading'
import toast from 'react-hot-toast'


const PAGE_SIZE = 10

export function AreasPage({ isSubAdmin }) {
  const {
    areas, createArea, updateArea, removeArea,
    page, setPage, search, setSearch, pageItems, totalElements, totalPages,
    pageLoading,
  } = useAreas()

  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [editTarget, setEditTarget] = useState(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEscapeToClose([
    [deleteModal, () => setDeleteModal(null)],
    [modalOpen, () => setModalOpen(false)],
  ])

  function openCreate() {
    setEditTarget(null)
    reset({ nombre: '', descripcion: '' })
    setModalOpen(true)
  }

  function openEdit(a) {
    setEditTarget(a)
    reset({ nombre: a.nombre, descripcion: a.descripcion })
    setModalOpen(true)
  }

  async function onSubmit(data) {
    setModalOpen(false)

    const promise = editTarget
      ? updateArea(editTarget.id, { nombre: data.nombre, descripcion: data.descripcion })
      : createArea({ nombre: data.nombre, descripcion: data.descripcion })

    toast.promise(promise, {
      loading: editTarget ? 'Actualizando área...' : 'Creando área...',
      success: editTarget ? '¡Área actualizada con éxito!' : '¡Área creada con éxito!',
      error: (err) => err.message || 'Ocurrió un error. Intenta nuevamente.'
    })
  }

  async function confirmDelete() {
    if (!deleteModal) return
    const target = deleteModal
    setDeleteModal(null)

    const promise = removeArea(target.id)

    toast.promise(promise, {
      loading: 'Eliminando área...',
      success: '¡Área eliminada con éxito!',
      error: (err) => err.message || 'No se pudo eliminar el área.'
    })
  }

  return (
    <div className="p-8 relative max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="font-bold">Áreas</h1>
      </div>

      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Buscar área..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <button onClick={() => console.log('Texto')} className='flex items-center mr-auto px-4 py-2 rounded-lg bg-transparent border border-primary text-transparent-foreground hover:opacity-75 transition-opacity'>
          <Search className="w-5 h-5" />
        </button>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Nueva Área
        </button>
      </div>

      <div className="border border-border rounded-xl overflow-x-auto bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 text-muted-foreground">#</th>
              <th className="text-left px-4 py-3 text-muted-foreground">Nombre del Área</th>
              <th className="text-left px-4 py-3 text-muted-foreground">Descripción</th>
              <th className="text-left px-4 py-3 text-muted-foreground">Estado</th>
              <th className="text-left px-4 py-3 text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pageLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-10">
                  <Loading message="Cargando áreas..." />
                </td>
              </tr>
            ) : pageItems.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No se encontraron áreas</td></tr>
            ) : (
              pageItems.map((a, idx) => (
                <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                  <td className="px-4 py-3 break-words max-w-[200px]">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4 text-primary" />
                      </div>
                      <span className="break-words min-w-0 block">{a.nombre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground break-words max-w-[350px]">{a.descripcion || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs ${a.estado === 'activa' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {a.estado === 'activa' ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(a)} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" title="Editar"><Pencil className="w-4 h-4" /></button>
                      {!isSubAdmin && (
                        <button onClick={() => setDeleteModal(a)} className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Eliminar">
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2>{editTarget ? 'Editar Área' : 'Nueva Área'}</h2>
                <p className="text-sm text-muted-foreground">{editTarget ? 'Modifica los datos del área' : 'Define los datos de la nueva área'}</p>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Nombre del área</label>
                <input maxLength={50} {...register('nombre', {
                  required: 'El nombre es requerido', maxLength: { value: 50, message: 'Máximo 50 caracteres' }, validate: (value) => {
                    const existe = areas.some(item =>
                      item.nombre.toLowerCase() === value.toLowerCase() &&
                      item.id !== editTarget?.id
                    );
                    return !existe || 'El área ya existe';
                  }
                })} type="text" placeholder="Ej. Costura" className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                {errors.nombre && <p className="text-xs text-destructive mt-1">{errors.nombre.message}</p>}
              </div>
              <div>
                <label className="block text-sm mb-1">Descripción</label>
                <textarea maxLength={500} {...register('descripcion', { maxLength: { value: 500, message: 'Máximo 500 caracteres' } })} rows={3} placeholder="Describe la función principal del área..." className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>
              {editTarget && (
                <div>
                  <label className="block text-sm mb-1">Estado</label>
                  <p className="text-xs text-muted-foreground">
                    Se actualiza automáticamente según si el área tiene usuarios activos asignados — actualmente{' '}
                    <strong>{editTarget.estado === 'activa' ? 'Activa' : 'Inactiva'}</strong>.
                  </p>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity">{editTarget ? 'Guardar Cambios' : 'Crear Área'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-sm mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-destructive" />
            </div>
            <h2 className="text-center mb-2">Eliminar Área</h2>
            <p className="text-center text-sm text-muted-foreground mb-6">¿Estás seguro de eliminar el área <strong>{deleteModal.nombre}</strong>? Esta acción no se puede deshacer.</p>
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
