import { useCallback, useEffect, useState } from 'react';
import AreasService from '../services/AreasService';

export function useAreas() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAreas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await AreasService.getAll();
      setAreas(Array.isArray(data) ? data : []);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

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
    }
    return nueva;
  }

  async function updateArea(id, payload) {
    setAreas((prev) => prev.map((a) => (a.id === id ? { ...a, ...payload } : a)));
    try {
      await AreasService.update(id, payload);
    } catch (e) {
      console.warn('AreasService.update', e);
    }
  }

  async function removeArea(id) {
    setAreas((prev) => prev.filter((a) => a.id !== id));
    try {
      await AreasService.remove(id);
    } catch (e) {
      console.warn('AreasService.remove', e);
    }
  }

  return { areas, loading, error, createArea, updateArea, removeArea, refetch: fetchAreas };
}
