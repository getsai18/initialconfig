import { useCallback, useEffect, useState } from 'react';
import ActivitiesService from '../services/ActivitiesService';

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

  async function createActivity(payload) {
    const nueva = { id: Date.now(), ...payload };
    setActivities((prev) => [...prev, nueva]);
    try {
      await ActivitiesService.create(nueva);
    } catch (e) {
      console.warn('ActivitiesService.create', e);
    } finally {
      fetchPage();
    }
    return nueva;
  }

  async function updateActivity(id, payload) {
    setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, ...payload } : a)));
    try {
      await ActivitiesService.update(id, payload);
    } catch (e) {
      console.warn('ActivitiesService.update', e);
    } finally {
      fetchPage();
    }
  }

  async function removeActivity(id) {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    try {
      await ActivitiesService.remove(id);
    } catch (e) {
      console.warn('ActivitiesService.remove', e);
    } finally {
      fetchPage();
    }
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
