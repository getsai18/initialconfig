import { useCallback, useEffect, useState } from 'react';
import PrendasService from '../services/PrendasService';
import { apiErrorMessage, isApiError } from '@/kernel/api/apiErrors';

export function usePrendas() {
  const [prendas, setPrendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrendas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await PrendasService.getAll();
      setPrendas(Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : []);
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

  // TipoPrendaRequest{nombre, categoria, icono, tallasDisponibles} — no tiene
  // "id" (autogenerado por el backend).
  async function createPrenda(payload) {
    const created = await PrendasService.create({ nombre: payload.nombre, categoria: payload.icono, icono: payload.icono });
    if (isApiError(created)) throw new Error(apiErrorMessage(created));
    await fetchPrendas();
    return created;
  }

  async function updatePrenda(id, payload) {
    const updated = await PrendasService.update(id, { nombre: payload.nombre, categoria: payload.icono, icono: payload.icono });
    if (isApiError(updated)) throw new Error(apiErrorMessage(updated));
    await fetchPrendas();
    return updated;
  }

  async function removePrenda(id) {
    const result = await PrendasService.remove(id);
    if (isApiError(result)) throw new Error(apiErrorMessage(result));
    await fetchPrendas();
    return result;
  }

  return { prendas, loading, error, createPrenda, updatePrenda, removePrenda, refetch: fetchPrendas };
}
