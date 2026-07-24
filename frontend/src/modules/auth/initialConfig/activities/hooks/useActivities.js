import { useCallback, useEffect, useState } from 'react';
import ActivitiesService from '../services/ActivitiesService';
import { apiErrorMessage, isApiError } from '@/kernel/api/apiErrors';

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;

export function useActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pageItems, setPageItems] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageLoading, setPageLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ActivitiesService.getAll();
      setActivities(Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : []);
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
      const data = await ActivitiesService.getPage({ page: page - 1, size: PAGE_SIZE, q: debouncedSearch });
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

  useEffect(() => { fetchActivities(); }, [fetchActivities]);
  useEffect(() => { fetchPage(); }, [fetchPage]);

  // ActividadCatalogoRequest{nombre, tipo, opciones, etiquetas, nota} — no
  // tiene "id" (el backend lo autogenera), así que no se manda.
  async function createActivity(payload) {
    const created = await ActivitiesService.create(payload);
    if (isApiError(created)) throw new Error(apiErrorMessage(created));
    await Promise.all([fetchActivities(), fetchPage()]);
    return created;
  }

  async function updateActivity(id, payload) {
    const updated = await ActivitiesService.update(id, payload);
    if (isApiError(updated)) throw new Error(apiErrorMessage(updated));
    await Promise.all([fetchActivities(), fetchPage()]);
    return updated;
  }

  async function removeActivity(id) {
    const result = await ActivitiesService.remove(id);
    if (isApiError(result)) throw new Error(apiErrorMessage(result));
    await Promise.all([fetchActivities(), fetchPage()]);
    return result;
  }

  return {
    activities,
    loading,
    error,
    createActivity,
    updateActivity,
    removeActivity,
    refetch: fetchActivities,
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
