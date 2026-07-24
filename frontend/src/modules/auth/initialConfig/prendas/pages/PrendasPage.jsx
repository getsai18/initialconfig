import { useState } from 'react'
import { Plus, Pencil, Trash2, Search, Shirt, Package, GraduationCap, Footprints } from 'lucide-react'
// TODO: reemplazar por íconos reales de "pants"/"cap" (no se copiaron los SVG originales del proyecto migrado)
const Pants = Footprints
const Cap = GraduationCap
import { useForm } from 'react-hook-form'
import { useEscapeToClose } from '@/kernel/hooks/useEscapeToClose'
import { usePrendas } from '../hooks/usePrendas'
import Loading from '@/kernel/components/Loading'
import toast from 'react-hot-toast'

const ICONOS = [
  { id: 'superiores', emoji: <Shirt />, label: 'Prenda superior', desc: 'Playeras, polos, chamarras...' },
  { id: 'inferiores', emoji: <Pants />, label: 'Prenda inferior', desc: 'Shorts, capris, pants...' },
  { id: 'accesorios', emoji: <Cap />, label: 'Accesorio', desc: 'Gorras, maletas, bolsos...' },
  { id: 'otros', emoji: <Package />, label: 'Otro', desc: 'Otros tipos de prenda' },
];

const iconoEmoji = {
  superiores: <Shirt />,
  inferiores: <Pants />,
  accesorios: <Cap />,
  otros: <Package />,
}

const iconoBg = { superiores: 'bg-gray-100', inferiores: 'bg-gray-100', accesorios: 'bg-gray-100', otros: 'bg-gray-50' }

export function PrendasPage({ isSubAdmin }) {
  const { prendas, loading, createPrenda, updatePrenda, removePrenda } = usePrendas()

  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [editTarget, setEditTarget] = useState(null)

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ defaultValues: { nombre: '', icono: 'superiores' } })

  useEscapeToClose([
    [deleteModal, () => setDeleteModal(null)],
    [modalOpen, () => setModalOpen(false)],
  ])
  const iconoWatched = watch('icono')

  const filtered = [...prendas]
    .sort((a, b) => b.id - a.id)
    .filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()))

  function openCreate() { setEditTarget(null); reset({ nombre: '', icono: 'superiores' }); setModalOpen(true) }
  function openEdit(p) { setEditTarget(p); reset({ nombre: p.nombre, icono: p.icono }); setModalOpen(true) }

  async function onSubmit(data) {
    setModalOpen(false)
    const promise = editTarget
      ? updatePrenda(editTarget.id, data)
      : createPrenda(data)

    toast.promise(promise, {
      loading: editTarget ? 'Actualizando prenda...' : 'Creando prenda...',
      success: editTarget ? '¡Prenda actualizada con éxito!' : '¡Prenda creada con éxito!',
      error: (err) => err.message || 'Ocurrió un error. Intenta nuevamente.'
    })
  }

  async function confirmDelete() {
    if (!deleteModal) return
    const target = deleteModal
    setDeleteModal(null)

    const promise = removePrenda(target.id)

    toast.promise(promise, {
      loading: 'Eliminando prenda...',
      success: '¡Prenda eliminada con éxito!',
      error: (err) => err.message || 'No se pudo eliminar la prenda.'
    })
  }

  return (
    <div className="p-8 relative max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className ="font-bold">Tipos de Prendas</h1>
      </div>

      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Buscar prenda..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <button onClick={() => console.log('Texto')} className='flex items-center mr-auto px-4 py-2 rounded-lg bg-transparent border border-primary text-transparent-foreground hover:opacity-75 transition-opacity'>
          <Search className="w-5 h-5" />
        </button>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Nueva Prenda
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loading message="Cargando tipos de prendas..." />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <img alt="" src="https://img.icons8.com/?size=100&id=10506&format=png&color=000000" className="w-12 mb-4 opacity-40" />
          <p className="text-muted-foreground">No se encontraron prendas</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="bg-card border border-border rounded-xl flex flex-col items-center pt-6 pb-4 px-3 hover:border-primary/40 hover:shadow-sm transition-all group">
              <div className={`w-16 h-16 rounded-2xl ${iconoBg[p.icono]} flex items-center justify-center mb-3`}>
                {iconoEmoji[p.icono]}
              </div>
              <p className="text-sm text-center leading-tight mb-4 px-1 break-words w-full">{p.nombre}</p>
              <div className="flex items-center justify-center gap-2 mt-auto">
                <button onClick={() => openEdit(p)} title={`Editar ${p.nombre}`} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                {!isSubAdmin && (
                  <button onClick={() => setDeleteModal(p)} title={`Eliminar ${p.nombre}`} className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground">{filtered.length} de {prendas.length} prendas</p>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-sm mx-4 p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                {iconoEmoji[iconoWatched]}
              </div>
              <div>
                <h2>{editTarget ? 'Editar Prenda' : 'Nueva Prenda'}</h2>
                <p className="text-sm text-muted-foreground">{editTarget ? 'Modifica el tipo de prenda' : 'Define el nuevo tipo de prenda'}</p>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm mb-1">Nombre de la prenda</label>
                <input maxLength={50} {...register('nombre', { required: 'El nombre es requerido', maxLength: { value: 50, message: 'Máximo 50 caracteres' }, validate: (value) => {
                  const existe = prendas.some(prenda =>
                    prenda.nombre.toLowerCase() === value.toLowerCase() &&
                    prenda.id !== editTarget?.id
                  );
                  return !existe || 'Esta prenda ya existe';
                } })} type="text" placeholder="Ej. Playera" className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                {errors.nombre && <p className="text-xs text-destructive mt-1">{errors.nombre.message}</p>}
              </div>
              <div>
                <label className="block text-sm mb-2">Icono representativo</label>
                <div className="grid grid-cols-2 gap-2">
                  {ICONOS.map(ic => (
                    <label key={ic.id} title={ic.desc} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${iconoWatched === ic.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 hover:bg-muted/30'}`}>
                      <input type="radio" value={ic.id} {...register('icono')} className="sr-only" />
                      {ic.emoji}
                      <div><p className="text-xs leading-tight">{ic.label}</p></div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity">{editTarget ? 'Guardar Cambios' : 'Crear Prenda'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-sm mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6 text-destructive" /></div>
            <h2 className="text-center mb-2">Eliminar Prenda</h2>
            <p className="text-center text-sm text-muted-foreground mb-6">¿Estás seguro de eliminar <strong>{deleteModal.nombre}</strong>? Esta acción no se puede deshacer.</p>
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
