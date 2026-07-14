import { useCallback, useEffect, useState } from 'react';
import UsersService from '../services/UsersService';

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pageItems, setPageItems] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageLoading, setPageLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await UsersService.getAll();
      setUsers(Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : []);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPage = useCallback(async () => {
    setPageLoading(true);
    try {
      const data = await UsersService.getPage({ page: page - 1, size: PAGE_SIZE, q: debouncedSearch });
      setPageItems(Array.isArray(data?.content) ? data.content : []);
      setTotalElements(data?.totalElements ?? 0);
      setTotalPages(Math.max(1, data?.totalPages ?? 1));
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setPageLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => { setPage(1); }, [debouncedSearch]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { fetchPage(); }, [fetchPage]);

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
    } finally {
      fetchPage();
    }
    return nuevo;
  }

  async function updateUser(id, payload) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...payload } : u)));
    try {
      await UsersService.update(id, payload);
    } catch (e) {
      console.warn('UsersService.update', e);
    } finally {
      fetchPage();
    }
  }

  async function removeUser(id) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    try {
      await UsersService.remove(id);
    } catch (e) {
      console.warn('UsersService.remove', e);
    } finally {
      fetchPage();
    }
  }

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    removeUser,
    refetch: fetchUsers,
    page,
    setPage,
    search,
    setSearch,
    pageItems,
    totalElements,
    totalPages,
    pageLoading,
  };
}
