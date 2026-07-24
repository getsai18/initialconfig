import { useCallback, useEffect, useState } from 'react';
import AreasService from '../services/AreasService';
import { apiErrorMessage, isApiError } from '@/kernel/api/apiErrors';

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

  // El campo "estado" se ignora en el backend (se autocalcula según los
  // usuarios asignados — ver AreaServiceImpl.sincronizarEstado), así que no
  // tiene caso seguir mandándolo/fabricándolo aquí.
  async function createArea(payload) {
    const created = await AreasService.create({ nombre: payload.nombre, descripcion: payload.descripcion });
    if (isApiError(created)) throw new Error(apiErrorMessage(created));
    await Promise.all([fetchAreas(), fetchPage()]);
    return created;
  }

  async function updateArea(id, payload) {
    const updated = await AreasService.update(id, { nombre: payload.nombre, descripcion: payload.descripcion });
    if (isApiError(updated)) throw new Error(apiErrorMessage(updated));
    await Promise.all([fetchAreas(), fetchPage()]);
    return updated;
  }

  async function removeArea(id) {
    const result = await AreasService.remove(id);
    if (isApiError(result)) throw new Error(apiErrorMessage(result));
    await Promise.all([fetchAreas(), fetchPage()]);
    return result;
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
