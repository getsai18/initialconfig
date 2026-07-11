import { useCallback, useEffect, useState } from 'react';
import DashboardService from '../services/DashboardService';

const EMPTY_STATS = { pendientes: 0, enProgreso: 0, enEspera: 0, incidencias: 0 };

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
