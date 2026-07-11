import { useCallback, useEffect, useState } from 'react';
import ActivitiesService from '../services/ActivitiesService';

export function useActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ActivitiesService.getAll();
      setActivities(Array.isArray(data) ? data : []);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  async function createActivity(payload) {
    const nueva = { id: Date.now(), ...payload };
    setActivities((prev) => [...prev, nueva]);
    try {
      await ActivitiesService.create(nueva);
    } catch (e) {
      console.warn('ActivitiesService.create', e);
    }
    return nueva;
  }

  async function updateActivity(id, payload) {
    setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, ...payload } : a)));
    try {
      await ActivitiesService.update(id, payload);
    } catch (e) {
      console.warn('ActivitiesService.update', e);
    }
  }

  async function removeActivity(id) {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    try {
      await ActivitiesService.remove(id);
    } catch (e) {
      console.warn('ActivitiesService.remove', e);
    }
  }

  return { activities, loading, error, createActivity, updateActivity, removeActivity, refetch: fetchActivities };
}
