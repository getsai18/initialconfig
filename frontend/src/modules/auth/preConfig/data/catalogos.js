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

export function getMockClientesInitial() {
  return [];
}

export async function cargarClientesGestor() {
  try {
    const res = await ApiGateway.doGet('/clientes');
    const clientesList = Array.isArray(res) ? res : (res?.data || []);
    
    const formattedClientes = clientesList.map(c => ({
      id: c.id,
      nombre: c.nombre,
      vendor: c.vendor || '',
      informacion: c.informacion || '',
      telefono: c.telefono || '',
      ultimoPedido: c.ultimoPedido || 'Sin pedidos',
      totalPedidos: c.totalPedidos || 0,
      pedidos: c.pedidos || []
    }));

    return {
      clientes: formattedClientes,
      counters: {
        ordenIdCounter: 10,
        pedidoIdCounter: 60,
        pedidoLastDate: '',
        pedidoDayCounter: 0
      }
    };
  } catch (e) {
    console.warn('Cargando clientes de respaldo local', e);
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
  return true;
}

export function mergeGestorClientes(local, fetched) {
  return fetched || local || [];
}
