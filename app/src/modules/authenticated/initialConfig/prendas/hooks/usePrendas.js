import { useCallback, useEffect, useState } from 'react';
import PrendasService from '../services/PrendasService';

export function usePrendas() {
  const [prendas, setPrendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrendas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await PrendasService.getAll();
      setPrendas(Array.isArray(data) ? data : []);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrendas();
  }, [fetchPrendas]);

  async function createPrenda(payload) {
    const nueva = { id: Date.now(), nombre: payload.nombre, icono: payload.icono };
    setPrendas((prev) => [...prev, nueva]);
    try {
      await PrendasService.create(nueva);
    } catch (e) {
      console.warn('PrendasService.create', e);
    }
    return nueva;
  }

  async function updatePrenda(id, payload) {
    setPrendas((prev) => prev.map((p) => (p.id === id ? { ...p, ...payload } : p)));
    try {
      await PrendasService.update(id, payload);
    } catch (e) {
      console.warn('PrendasService.update', e);
    }
  }

  async function removePrenda(id) {
    setPrendas((prev) => prev.filter((p) => p.id !== id));
    try {
      await PrendasService.remove(id);
    } catch (e) {
      console.warn('PrendasService.remove', e);
    }
  }

  return { prendas, loading, error, createPrenda, updatePrenda, removePrenda, refetch: fetchPrendas };
}
