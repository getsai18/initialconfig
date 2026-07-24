export function generarCodigo() {
  const d = new Date();
  return `ORD-${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}-${Math.floor(Math.random() * 1000)}`;
}

export function tipoSolicitudLimpio(tipo) {
  return tipo ? tipo.replace(/\s+/g, '') : '';
}

export function pedidoVencido(fecha) {
  if (!fecha) return false;
  return new Date(fecha) < new Date();
}

export function generarOrdenDisplayId(code) {
  return code || 'ORD-0000';
}

export function generarOrdenInternalCode(code) {
  return code || 'INT-0000';
}

export function disciplinaAbrev(disciplina) {
  if (!disciplina) return 'NA';
  return disciplina.substring(0, 3).toUpperCase();
}

export function displayStatus(s) { return s || 'Borrador'; }
export function statusBadgeCls(s) { return 'bg-blue-100 text-blue-800'; }
export function adjuntoExtInfo(type, name) { 
  return { iconName: 'file', colorCls: 'text-blue-500 bg-blue-100' };
}
