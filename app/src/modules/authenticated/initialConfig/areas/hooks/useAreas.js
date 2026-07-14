import { useCallback, useEffect, useState } from 'react';
import AreasService from '../services/AreasService';

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;

export function useAreas() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pageItems, setPageItems] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageLoading, setPageLoading] = useState(true);

  const fetchAreas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await AreasService.getAll();
      setAreas(Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : []);
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
      const data = await AreasService.getPage({ page: page - 1, size: PAGE_SIZE, q: debouncedSearch });
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

  useEffect(() => { fetchAreas(); }, [fetchAreas]);
  useEffect(() => { fetchPage(); }, [fetchPage]);

  async function createArea(payload) {
    const nueva = {
      id: Date.now(),
      nombre: payload.nombre,
      descripcion: payload.descripcion,
      estado: 'inactiva',
    };
    setAreas((prev) => [...prev, nueva]);
    try {
      await AreasService.create(nueva);
    } catch (e) {
      console.warn('AreasService.create', e);
    } finally {
      fetchPage();
    }
    return nueva;
  }

  async function updateArea(id, payload) {
    setAreas((prev) => prev.map((a) => (a.id === id ? { ...a, ...payload } : a)));
    try {
      await AreasService.update(id, payload);
    } catch (e) {
      console.warn('AreasService.update', e);
    } finally {
      fetchPage();
    }
  }

  async function removeArea(id) {
    setAreas((prev) => prev.filter((a) => a.id !== id));
    try {
      await AreasService.remove(id);
    } catch (e) {
      console.warn('AreasService.remove', e);
    } finally {
      fetchPage();
    }
  }

  return {
    areas,
    loading,
    error,
    createArea,
    updateArea,
    removeArea,
    refetch: fetchAreas,
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
