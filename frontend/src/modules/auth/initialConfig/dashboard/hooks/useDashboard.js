import { useCallback, useEffect, useState } from 'react';
import DashboardService from '../services/DashboardService';

// Debe reflejar exactamente StatsResponse del backend (ver DashboardServiceImpl):
// enProgreso/enProduccion/terminadas son conteos reales de Orden.status;
// incidencias queda fija en 0 hasta que exista ese módulo en el backend.
const EMPTY_STATS = { enProgreso: 0, enProduccion: 0, terminadas: 0, incidencias: 0 };

export function useDashboard() {
  const [stats, setStats] = useState(EMPTY_STATS);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const data = await DashboardService.getSummary();
      setStats(data?.stats || EMPTY_STATS);
      setOrders(Array.isArray(data?.orders) ? data.orders : []);
      setError(null);
    } catch (e) {
      setError(e);
      setStats(EMPTY_STATS);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { stats, orders, loading, error, refetch: fetchSummary };
}
