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
    setUsers((prev) => [...prev, nuevo]);
    try {
      await UsersService.create(nuevo);
    } catch (e) {
      console.warn('UsersService.create', e);
    }
    return nuevo;
  }

  async function updateUser(id, payload) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...payload } : u)));
    try {
      await UsersService.update(id, payload);
    } catch (e) {
      console.warn('UsersService.update', e);
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
