import { useState } from 'react'
import { Plus, Pencil, Trash2, Search, Building2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Pagination } from '@/kernel/components/Pagination'
import { SuccessModal } from '@/kernel/components/SuccessModal'
import { useEscapeToClose } from '@/kernel/hooks/useEscapeToClose'
import { useAreas } from '../hooks/useAreas'
import Loading from '@/kernel/components/Loading'

import { useAuth } from '@/kernel/context/AuthContext'

const PAGE_SIZE = 10

export function AreasPage() {
  const { isSubAdmin } = useAuth()
  const {
    areas, createArea, updateArea, removeArea,
    page, setPage, search, setSearch, pageItems, totalElements, totalPages,
    pageLoading,
  } = useAreas()

  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [editTarget, setEditTarget] = useState(null)

  const [successModal, setSuccessModal] = useState(null)
  const [editSuccessModal, setEditSuccessModal] = useState(null)

  // Estados de carga de peticiones
  const [isSaving, setIsSaving] = useState(false)
  const [savingMessage, setSavingMessage] = useState('Guardando...')

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEscapeToClose([
    [successModal, () => setSuccessModal(null)],
    [editSuccessModal, () => setEditSuccessModal(null)],
    [deleteModal, () => setDeleteModal(null)],
    [modalOpen, () => setModalOpen(false)],
  ])

  function openCreate() {
    setEditTarget(null)
    reset({ nombre: '', descripcion: '', estado: 'inactiva' })
    setModalOpen(true)
  }

  function openEdit(a) {
    setEditTarget(a)
    reset({ nombre: a.nombre, descripcion: a.descripcion, estado: a.estado })
    setModalOpen(true)
  }

  async function onSubmit(data) {
    setSavingMessage(editTarget ? 'Actualizando área...' : 'Creando área...')
    setIsSaving(true)
    try {
      if (editTarget) {
        await updateArea(editTarget.id, { nombre: data.nombre, descripcion: data.descripcion, estado: data.estado })
        setModalOpen(false)
        setEditSuccessModal(data)
      } else {
        const nueva = await createArea({ nombre: data.nombre, descripcion: data.descripcion })
        setSuccessModal(nueva)
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
    setSavingMessage('Eliminando área...')
    setIsSaving(true)
    try {
      await removeArea(deleteModal.id)
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
      <div className="mb-8">
        <h1 className ="font-bold">Áreas</h1>
      </div>

      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Buscar área..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>

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
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4 text-primary" />
                      </div>
                      <span>{a.nombre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{a.descripcion || '—'}</td>
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
                <input {...register('nombre', { required: 'El nombre es requerido', maxLength: { value: 30, message: 'Máximo 30 caracteres' }, validate: (value) => {
                  const existe = areas.some(item =>
                    item.nombre.toLowerCase() === value.toLowerCase() &&
                    item.id !== editTarget?.id
                  );
                  return !existe || 'El área ya existe';
                } })} type="text" placeholder="Ej. Costura" className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                {errors.nombre && <p className="text-xs text-destructive mt-1">{errors.nombre.message}</p>}
              </div>
              <div>
                <label className="block text-sm mb-1">Descripción</label>
                <textarea {...register('descripcion', { maxLength: { value: 130, message: 'Máximo 130 caracteres' } })} rows={3} placeholder="Describe la función principal del área..." className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>
              {editTarget && (
                <div>
                  <label className="block text-sm mb-1">Estado</label>
                  <select {...register('estado')} className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="activa">Activa</option>
                    <option value="inactiva">Inactiva</option>
                  </select>
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

      <SuccessModal
        isOpen={!!successModal}
        onClose={() => setSuccessModal(null)}
        title="¡Área Creada!"
        message={
          <>
            El área <strong>{successModal?.nombre}</strong> se ha registrado correctamente en el sistema.
          </>
        }
      />

      <SuccessModal
        isOpen={!!editSuccessModal}
        onClose={() => setEditSuccessModal(null)}
        title="¡Área Actualizada!"
        message={
          <>
            Los datos del área <strong>{editSuccessModal?.nombre}</strong> se han actualizado correctamente.
          </>
        }
      />
    </div>
  )
}
