import { useCallback, useEffect, useState } from 'react';
import ClientesService from '../services/ClientesService';

export function useClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ClientesService.getAll();
      setClientes(Array.isArray(data) ? data : []);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

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
    }
    return nuevo;
  }

  async function updateCliente(id, payload) {
    setClientes((prev) => prev.map((c) => (c.id === id ? { ...c, ...payload } : c)));
    try {
      await ClientesService.update(id, payload);
    } catch (e) {
      console.warn('ClientesService.update', e);
    }
  }

  async function removeCliente(id) {
    setClientes((prev) => prev.filter((c) => c.id !== id));
    try {
      await ClientesService.remove(id);
    } catch (e) {
      console.warn('ClientesService.remove', e);
    }
  }

  return { clientes, loading, error, createCliente, updateCliente, removeCliente, refetch: fetchClientes };
}
