import ApiGateway from '@/kernel/api/ApiGateway';

export const LS_KEY = 'preconfig_clientes_local';
export const LS_KEY_OIDS = 'preconfig_ordenes_local';

export const prendasCatalogo = {
  superiores: ['Playera Polo', 'Playera Cuello Redondo', 'Camisa', 'Chamarra', 'Sudadera'],
  inferiores: ['Pantalón', 'Short', 'Falda'],
  accesorios: ['Gorra', 'Mandil', 'Mochila', 'Gafete'],
  otros: ['Otro']
};

export const tallasConfig = {
  superiores: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
  inferiores: ['28', '30', '32', '34', '36', '38', '40', '42'],
  accesorios: ['U'],
  otros: ['U']
};

export const areasConfig = [
  { id: 1, nombre: 'Diseño' },
  { id: 2, nombre: 'Corte' },
  { id: 3, nombre: 'Confección' },
  { id: 4, nombre: 'Estampado' },
  { id: 5, nombre: 'Bordado' },
  { id: 6, nombre: 'Empaque' }
];

export const defaultActividades = [
  { nombre: 'Corte de tela', tipo: 'checkbox' },
  { nombre: 'Impresión', tipo: 'checkbox' },
  { nombre: 'Bordado logo', tipo: 'checkbox' }
];

export async function getCatalogoActividad() {
  try {
    const data = await ApiGateway.doGet('/activities');
    if (data && Array.isArray(data) && data.length > 0) {
      return data.map(act => ({
        nombre: act.nombre,
        tipo: act.tipo,
        opciones: act.opciones,
        etiquetas: act.etiquetas,
        nota: act.nota
      }));
    }
    return defaultActividades;
  } catch (e) {
    return defaultActividades;
  }
}

// Reemplazo de PouchDB
export async function getMockClientesInitial() {
  return [];
}

export async function cargarClientesGestor() {
  try {
    const cached = localStorage.getItem(LS_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && Array.isArray(parsed.clientes) && parsed.counters) {
        return parsed;
      }
    }
    
    // Fallback: load base clients from backend `/clientes`
    const baseClientes = await ApiGateway.doGet('/clientes');
    const clientesList = Array.isArray(baseClientes) ? baseClientes : [];
    
    const formattedClientes = clientesList.map(c => ({
      id: c.id,
      nombre: c.nombre,
      vendor: c.vendor || '',
      informacion: c.informacion || '',
      telefono: '',
      ultimoPedido: 'Sin pedidos',
      totalPedidos: 0,
      pedidos: []
    }));

    const initialData = {
      clientes: formattedClientes,
      counters: {
        ordenIdCounter: 10,
        pedidoIdCounter: 60,
        pedidoLastDate: '',
        pedidoDayCounter: 0
      }
    };

    localStorage.setItem(LS_KEY, JSON.stringify(initialData));
    return initialData;
  } catch (e) {
    console.error('Error cargando clientes gestor', e);
    return {
      clientes: [],
      counters: {
        ordenIdCounter: 10,
        pedidoIdCounter: 60,
        pedidoLastDate: '',
        pedidoDayCounter: 0
      }
    };
  }
}

export async function guardarDB(clientes, counters) {
  try {
    const dataToSave = { clientes, counters };
    localStorage.setItem(LS_KEY, JSON.stringify(dataToSave));
    return true;
  } catch (e) {
    console.error('Error guardando DB local', e);
    return false;
  }
}

export function mergeGestorClientes(local, fetched) {
  return fetched;
}
