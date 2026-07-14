import { useCallback, useEffect, useState } from 'react';
import ClientesService from '../services/ClientesService';

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;

export function useClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pageItems, setPageItems] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageLoading, setPageLoading] = useState(true);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ClientesService.getAll();
      setClientes(Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : []);
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
      const data = await ClientesService.getPage({ page: page - 1, size: PAGE_SIZE, q: debouncedSearch });
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

  useEffect(() => { fetchClientes(); }, [fetchClientes]);
  useEffect(() => { fetchPage(); }, [fetchPage]);

  async function createCliente(payload) {
    const nuevo = {
      id: crypto.randomUUID(),
      nombre: payload.nombre,
      vendor: payload.vendor,
      informacion: payload.informacion,
      fechaRegistro: new Date().toISOString().split('T')[0],
      pedidos: [],
    };
    setClientes((prev) => [...prev, nuevo]);
    try {
      await ClientesService.create(nuevo);
    } catch (e) {
      console.warn('ClientesService.create', e);
    } finally {
      fetchPage();
    }
    return nuevo;
  }

  async function updateCliente(id, payload) {
    setClientes((prev) => prev.map((c) => (c.id === id ? { ...c, ...payload } : c)));
    try {
      await ClientesService.update(id, payload);
    } catch (e) {
      console.warn('ClientesService.update', e);
    } finally {
      fetchPage();
    }
  }

  async function removeCliente(id) {
    setClientes((prev) => prev.filter((c) => c.id !== id));
    try {
      await ClientesService.remove(id);
    } catch (e) {
      console.warn('ClientesService.remove', e);
    } finally {
      fetchPage();
    }
  }

  return {
    clientes,
    loading,
    error,
    createCliente,
    updateCliente,
    removeCliente,
    refetch: fetchClientes,
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
