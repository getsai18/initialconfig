import ApiGateway from '@/kernel/api/ApiGateway';

export const LS_KEY = 'preconfig_clientes_local';
export const LS_KEY_OIDS = 'preconfig_ordenes_local';

export const prendasCatalogo = [
  { nombre: 'Playera Polo', icono: '👕' },
  { nombre: 'Playera Cuello Redondo', icono: '👕' },
  { nombre: 'Camisa', icono: '👕' },
  { nombre: 'Chamarra', icono: '👕' },
  { nombre: 'Sudadera', icono: '👕' },
  { nombre: 'Pantalón', icono: '🩳' },
  { nombre: 'Short', icono: '🩳' },
  { nombre: 'Falda', icono: '🩳' },
  { nombre: 'Gorra', icono: '🎒' },
  { nombre: 'Mandil', icono: '🎒' },
  { nombre: 'Mochila', icono: '🎒' },
  { nombre: 'Gafete', icono: '🎒' }
];

export const tallasConfig = {
  hombre: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
  mujer: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
  niño: ['2', '4', '6', '8', '10', '12', '14', '16']
};

export const areasConfig = [
  { id: 1, nombre: 'Diseño', color: '#eab308' },
  { id: 2, nombre: 'Corte', color: '#eab308' },
  { id: 3, nombre: 'Confección', color: '#10b981' },
  { id: 4, nombre: 'Estampado', color: '#ec4899' },
  { id: 5, nombre: 'Bordado', color: '#8b5cf6' },
  { id: 6, nombre: 'Empaque', color: '#3b82f6' }
];

export const defaultActividades = [
  { nombre: 'Corte de tela', tipo: 'checkbox', opciones: ['Lycra', 'Algodón', 'Poliéster'], etiquetas: ['Corte'] },
  { nombre: 'Impresión', tipo: 'radio', opciones: ['Serigrafía', 'Sublimación', 'Vinil'], etiquetas: ['Estampado'] },
  { nombre: 'Bordado logo', tipo: 'texto', opciones: [], etiquetas: ['Bordado'] }
];

export function getCatalogoActividad(nombre) {
  return defaultActividades.find(a => a.nombre === nombre);
}

// Reemplazo de PouchDB
export function getMockClientesInitial() {
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
