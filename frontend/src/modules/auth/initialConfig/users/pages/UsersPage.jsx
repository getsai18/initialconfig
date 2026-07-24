import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Search, MonitorSmartphone } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Pagination } from '@/kernel/components/Pagination'
import { normalizeText } from '@/kernel/utils/normalizeText'
import { useEscapeToClose } from '@/kernel/hooks/useEscapeToClose'
import { ROLE_LABELS as roleConfig } from '@/kernel/auth/roleLabels'
import { useUsers } from '../hooks/useUsers'
import { useAreas } from '../../areas/hooks/useAreas'
import Loading from '@/kernel/components/Loading'
import toast from 'react-hot-toast'

const PAGE_SIZE = 10

const estadoConfig = {
  activo: { label: 'Activo', color: 'bg-green-100 text-green-700' },
  inactivo: { label: 'Inactivo', color: 'bg-gray-100 text-gray-600' },
}

export function UsersPage({ isSubAdmin }) {
  const {
    users: usuarios, createUser, updateUser, removeUser,
    page, setPage, search, setSearch, pageItems, totalElements, totalPages,
    pageLoading,
  } = useUsers()
  const { areas } = useAreas()

  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [editTarget, setEditTarget] = useState(null)

  // Agregamos 'setValue' para poder modificar el areaId dinámicamente desde el useEffect
  const { register, handleSubmit, reset, watch, setValue, formState: { errors }, } = useForm()

  // Escuchamos el valor del campo 'role'
  const selectedRole = watch('role')

  // EFFECT: Escucha los cambios del rol para limpiar el área en roles que no la usan
  useEffect(() => {
    if (!selectedRole) return;

    if (selectedRole === 'SUB_ADMIN' || selectedRole === 'ADMIN' || selectedRole === 'MANAGEMENT' || selectedRole === 'ATTENDANCE') {
      setValue('areaId', '');
    }
  }, [selectedRole, setValue]);

  // Filtrado de áreas para renderizar las opciones del select en tiempo real
  // (solo aplica a EMPLOYEE, único rol que hoy usa este campo)
  const filteredAreasForSelect = areas.filter(a => {
    const normalized = normalizeText(a.nombre);
    if (selectedRole === 'EMPLOYEE') return !normalized.includes('gestion de ordenes') && !normalized.includes('atencion a clientes');
    return true;
  });

  useEscapeToClose([
    [deleteModal, () => setDeleteModal(null)],
    [modalOpen, () => setModalOpen(false)],
  ])

  const areaName = (areaId) => areas.find(a => a.id === areaId)?.nombre ?? '—'

  const availableAreas = areas.filter(a =>
    !usuarios.some(u => u.areaId === a.id && u.id !== editTarget?.id)
  )

  function openCreate() {
    setEditTarget(null)
    reset({ usuario: '', nombre: '', email: '', role: '', areaId: '', password: '', estado: 'activo' })
    setModalOpen(true)
  }

  function openEdit(u) {
    setEditTarget(u)
    reset({ usuario: u.usuario ?? '', nombre: u.nombre, email: u.email, role: u.role ?? '', areaId: u.areaId ?? '', estado: u.estado })
    setModalOpen(true)
  }

  async function onSubmit(data) {
    setModalOpen(false)
    const areaId = data.areaId !== '' ? Number(data.areaId) : null
    const usuarioNormalized = data.usuario ? data.usuario.toLowerCase() : ''
    const payload = { ...data, usuario: usuarioNormalized, areaId }

    const promise = editTarget
      ? updateUser(editTarget.id, payload)
      : createUser(payload)

    toast.promise(promise, {
      loading: editTarget ? 'Actualizando usuario...' : 'Creando usuario...',
      success: editTarget ? '¡Usuario actualizado con éxito!' : '¡Usuario registrado con éxito!',
      error: (err) => err.message || 'Ocurrió un error. Intenta nuevamente.'
    })
  }

  async function confirmDelete() {
    if (!deleteModal) return
    const target = deleteModal
    setDeleteModal(null)

    const promise = removeUser(target.id)

    toast.promise(promise, {
      loading: 'Eliminando usuario...',
      success: '¡Usuario eliminado con éxito!',
      error: (err) => err.message || 'No se pudo eliminar el usuario.'
    })
  }

  return (
    <div className="p-8 relative max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="font-bold">Usuarios</h1>
      </div>

      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button onClick={() => console.log('Texto')} className='flex items-center mr-auto px-4 py-2 rounded-lg bg-transparent border border-primary text-transparent-foreground hover:opacity-75 transition-opacity'>
          <Search className="w-5 h-5" />
        </button>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Nuevo Usuario
        </button>
      </div>

      <div className="border border-border rounded-xl overflow-x-auto bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 text-muted-foreground">#</th>
              <th className="text-left px-4 py-3 text-muted-foreground">Nombre</th>
              <th className="text-left px-4 py-3 text-muted-foreground">Usuario</th>
              <th className="text-left px-4 py-3 text-muted-foreground">Correo</th>
              <th className="text-left px-4 py-3 text-muted-foreground">Rol</th>
              <th className="text-left px-4 py-3 text-muted-foreground">Área</th>
              <th className="text-left px-4 py-3 text-muted-foreground">Estado</th>
              <th className="text-left px-4 py-3 text-muted-foreground">Fecha de Alta</th>
              <th className="text-left px-4 py-3 text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pageLoading ? (
              <tr>
                <td colSpan={9} className="px-4 py-10">
                  <Loading message="Cargando usuarios..." />
                </td>
              </tr>
            ) : pageItems.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">No se encontraron usuarios</td>
              </tr>
            ) : (
              pageItems.map((u, idx) => (
                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                  <td className="px-4 py-3 break-words max-w-[150px]">
                    {u.nombre}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground break-words max-w-[120px]">{u.usuario}</td>
                  <td className="px-4 py-3 text-muted-foreground break-words max-w-[200px]">{u.email}</td>
                  <td className="px-4 py-3 font-medium text-xs text-muted-foreground">
                    {roleConfig[u.role] || '—'}
                  </td>
                  <td className="px-4 py-3">
                    {u.areaId ? (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">{areaName(u.areaId)}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs ${estadoConfig[u.estado].color}`}>
                      {estadoConfig[u.estado].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.fechaCreacion}</td>
                  <td className="px-4 py-3">
                    <div className="flex mx-auto items-center justify-center gap-2">
                      <button onClick={() => openEdit(u)} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" title="Editar">
                        <Pencil className="w-4 h-4" />
                      </button>

                      {!isSubAdmin && u.role !== 'ADMIN' && (
                        <button onClick={() => setDeleteModal(u)} className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Eliminar">
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
                <MonitorSmartphone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2>{editTarget ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                <p className="text-sm text-muted-foreground">{editTarget ? 'Modifica los datos del usuario' : 'Registra un nuevo usuario en la plataforma'}</p>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                  <label className="block text-sm mb-1">Usuario</label>
                   <input
                    maxLength={12}
                    {...register('usuario', {
                      required: 'El usuario es requerido',
                      minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                      maxLength: { value: 12, message: 'Máximo 12 caracteres' },
                      pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Solo se permiten letras, números y _' },
                      validate: (value) => {
                      const existe = usuarios.some(u =>
                        u.usuario?.toLowerCase() === value.toLowerCase() && u.id !== editTarget?.id
                      );
                      return !existe || 'Este usuario ya está registrado';
                      }
                      })}
                    type="text"
                    placeholder="Ej. corte"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring lowercase"
                    />
                  {errors.usuario && <p className="text-xs text-destructive mt-1">{errors.usuario.message}</p>}
              </div>
              <div>
              <label className="block text-sm mb-1">Nombre</label>
              <input maxLength={50} {...register('nombre', { required: 'El nombre es requerido', maxLength: { value: 50, message: 'Máximo 50 caracteres' } })} type="text" placeholder="Ej. Juan Pérez" className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                {errors.nombre && <p className="text-xs text-destructive mt-1">{errors.nombre.message}</p>}
              </div>
              <div>
              <label className="block text-sm mb-1">Correo electrónico</label>
              <input
              maxLength={100}
             {...register('email', {
                    required: 'El correo es requerido',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido' },
                    maxLength: { value: 100, message: 'Máximo 100 caracteres' }
             })}
              type="email"
              placeholder="juan@uniformespro.com"
              className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>

          {/* Selector de Rol */}
          <div>
            <label className="block text-sm mb-1">Rol</label>
            {editTarget?.role === 'ADMIN' ? (
              <>
                <input type="hidden" {...register('role')} />
                <input
                  type="text"
                  value="Administrador"
                  disabled
                  readOnly
                  className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-sm text-muted-foreground cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground mt-1">El rol del Administrador no se puede modificar.</p>
              </>
            ) : (
              <select
                {...register('role', { required: 'El rol es requerido' })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Selecciona un rol</option>
                <option value="SUB_ADMIN">Subadministrador</option>
                <option value="MANAGEMENT">Gestor de Órdenes</option>
                <option value="EMPLOYEE">Empleado</option>
                <option value="ATTENDANCE">Atención al Cliente</option>
              </select>
            )}
            {errors.role && <p className="text-xs text-destructive mt-1">{errors.role.message}</p>}
          </div>

          {/* Campo de Área Asignada inteligente y dinámico */}
          {selectedRole && selectedRole !== 'ADMIN' && selectedRole !== 'SUB_ADMIN' && selectedRole !== 'MANAGEMENT' &&
            selectedRole !== 'ATTENDANCE' &&  (
            <div>
              <label className="block text-sm mb-1">Área asignada</label>
              <select
                {...register('areaId', { required: 'El área es requerida' })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-75 disabled:bg-muted"
              >
                {selectedRole === 'EMPLOYEE' && <option value="">Seleccionar área</option>}

                {filteredAreasForSelect.map(a => (
                  <option key={a.id} value={a.id}>{a.nombre}</option>
                ))}

                {editTarget && editTarget.areaId && !availableAreas.find(a => a.id === editTarget.areaId) && (
                  <option value={editTarget.areaId}>{areaName(editTarget.areaId)}</option>
                )}
              </select>
              {errors.areaId && <p className="text-xs text-destructive mt-1">{errors.areaId.message}</p>}
            </div>
          )}

          {editTarget && (
            <div>
              <label className="block text-sm mb-1">Estado</label>
              {editTarget.role === 'ADMIN' ? (
                <>
                  <input type="hidden" {...register('estado')} />
                  <input
                    type="text"
                    value={estadoConfig[editTarget.estado]?.label ?? editTarget.estado}
                    disabled
                    readOnly
                    className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-sm text-muted-foreground cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground mt-1">El estado del Administrador no se puede modificar.</p>
                </>
              ) : (
                <select {...register('estado')} className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent transition-colors">Cancelar</button>
            <button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity">{editTarget ? 'Guardar Cambios' : 'Crear Usuario'}</button>
          </div>
        </form>
      </div>
    </div>
  )}

      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDeleteModal(null)}>
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-sm mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-destructive" />
            </div>
            <h2 className="text-center mb-2">Eliminar Usuario</h2>
            <p className="text-center text-sm text-muted-foreground mb-6">
              ¿Estás seguro de eliminar a <strong>{deleteModal.nombre}</strong>?{' '}
              {deleteModal.areaId && <span>El área <strong>{areaName(deleteModal.areaId)}</strong> puede quedar inactiva.</span>}
            </p>
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
