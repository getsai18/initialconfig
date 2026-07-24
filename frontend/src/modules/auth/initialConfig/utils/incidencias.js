export function getAreasAsignadas(inc) {
  if (!inc) return [];
  if (Array.isArray(inc.areasAsignadas)) return inc.areasAsignadas;
  if (Array.isArray(inc.areas)) return inc.areas;
  if (typeof inc.areasAsignadas === 'string') {
    return inc.areasAsignadas.split(',').map(s => s.trim()).filter(Boolean);
  }
  if (typeof inc.areas === 'string') {
    return inc.areas.split(',').map(s => s.trim()).filter(Boolean);
  }
  
  const possibleAreas = ['corte', 'costura', 'estampado', 'serigrafia', 'empaque', 'diseño', 'calidad'];
  const found = [];
  possibleAreas.forEach(a => {
    if (inc[a] === true || inc[a] === 'true' || inc[a] === 1) {
      found.push(a.charAt(0).toUpperCase() + a.slice(1));
    }
  });
  if (found.length > 0) return found;
  
  return [];
}

export function formatAreasLabel(areas) {
  if (!areas) return '—';
  if (typeof areas === 'string') return areas;
  if (Array.isArray(areas)) {
    return areas.length > 0 ? areas.join(', ') : '—';
  }
  return '—';
}
