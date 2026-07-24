import { useCallback, useEffect, useState } from 'react';
import UsersService from '../services/UsersService';
import { apiErrorMessage, isApiError } from '@/kernel/api/apiErrors';

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

  // Nota: no hay actualización optimista — se espera la respuesta real del
  // backend (con su id/estado reales) y, si es un error, se relanza como
  // excepción para que la página lo capture y NO muestre éxito falso.
  async function createUser(payload) {
    const created = await UsersService.create(payload);
    if (isApiError(created)) throw new Error(apiErrorMessage(created));
    await Promise.all([fetchUsers(), fetchPage()]);
    return created;
  }

  async function updateUser(id, payload) {
    const updated = await UsersService.update(id, payload);
    if (isApiError(updated)) throw new Error(apiErrorMessage(updated));
    await Promise.all([fetchUsers(), fetchPage()]);
    return updated;
  }

  async function removeUser(id) {
    const result = await UsersService.remove(id);
    if (isApiError(result)) throw new Error(apiErrorMessage(result));
    await Promise.all([fetchUsers(), fetchPage()]);
    return result;
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
