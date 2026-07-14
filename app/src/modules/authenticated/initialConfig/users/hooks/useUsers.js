import { useCallback, useEffect, useState } from 'react';
import UsersService from '../services/UsersService';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await UsersService.getAll();
      setUsers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);



  async function createUser(payload) {
    const nuevo = {
      id: Date.now(),
      usuario: payload.usuario,
      nombre: payload.nombre,
      email: payload.email,
      password: payload.password,
      role: payload.role,
      areaId: payload.areaId,
      estado: 'activo',
      fechaCreacion: new Date().toISOString().split('T')[0],
    };

    const res = await UsersService.create(nuevo);
    if (!res || res.error || (res.status && res.status >= 400)) {
      throw new Error(res?.message || 'El usuario o correo electrónico ya existe.');
    }

    setUsers((prev) => [...prev, res]);
    return res;
  }

  async function updateUser(id, payload) {
    const originalUsers = [...users];
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...payload } : u)));
    try {
      const res = await UsersService.update(id, payload);
      if (!res || res.error || (res.status && res.status >= 400)) {
        throw new Error(res?.message || 'Error al actualizar el usuario');
      }
    } catch (e) {
      console.warn('UsersService.update', e);
      setUsers(originalUsers);
      throw e;
    }
  }

  async function removeUser(id) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    try {
      await UsersService.remove(id);
    } catch (e) {
      console.warn('UsersService.remove', e);
    }
  }

  return { users, loading, error, createUser, updateUser, removeUser, refetch: fetchUsers };
}
