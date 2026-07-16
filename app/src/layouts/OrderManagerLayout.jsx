import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import Topbar from '../modules/authenticated/preConfig/pages/TopBar';
import ClientesScreen from '../modules/authenticated/preConfig/clientes/pages/ClientesScreen';
import PedidosScreen from '../modules/authenticated/preConfig/pedidos/pages/PedidosScreen';
import DetallePedidoScreen from '../modules/authenticated/preConfig/pedidos/pages/DetallePedidoScreen';
import NuevaOrdenScreen from '../modules/authenticated/preConfig/orders/pages/NuevaOrdenScreen';
import IncidenciasGestorScreen from '../modules/authenticated/preConfig/incidencias/pages/IncidenciasGestorScreen';
import ConfirmModal from '../modules/authenticated/preConfig/shared/components/ConfirmModal';
import OrdenDetalleModal from '../modules/authenticated/preConfig/orders/components/OrdenDetalleModal';
import ActividadesModal from '../modules/authenticated/preConfig/orders/components/ActividadesModal';
import KitModal from '../modules/authenticated/preConfig/shared/components/KitModal';
import KitOrdenesModal from '../modules/authenticated/preConfig/shared/components/KitOrdenesModal';
import LogoutModal from '../modules/authenticated/preConfig/shared/components/LogoutModal';
import {
  getMockClientesInitial, guardarDB, cargarClientesGestor, mergeGestorClientes,
  areasConfig, getCatalogoActividad, defaultActividades,
  LS_KEY, LS_KEY_OIDS,
} from '../modules/authenticated/preConfig/data/catalogos';
import { deleteDoc, getDoc, setDoc } from '../modules/authenticated/preConfig/app/storage';
import { db } from '../modules/authenticated/preConfig/app/db';
import { Sidebar } from './Sidebar';
import { UserCircle, ClipboardCheck, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/kernel/context/AuthContext';
import { ConfirmacionesMaterial } from '../modules/authenticated/initialConfig/materialCheck/pages/ConfirmacionesMaterial';
import {
  pedidoVencido, tipoSolicitudLimpio,
  generarOrdenDisplayId, generarOrdenInternalCode,
} from '../modules/authenticated/preConfig/utils/helpers';

export default function OrderManager({ onLogout = null }) {
  const { user } = useAuth();
  // ─── Data ───────────────────────────────────────────────
  const [clientes, setClientes] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);
  const countersRef = useRef({ ordenIdCounter: 10, pedidoIdCounter: 60, pedidoLastDate: '', pedidoDayCounter: 0 });

  // ─── Pedido ID generator: PED-ddMMyyyyHHmmss-0000 ────────
  function generarNuevoPedidoId() {
    const hoy = new Date();
    const dd = String(hoy.getDate()).padStart(2, '0');
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const yyyy = hoy.getFullYear();
    const HH = String(hoy.getHours()).padStart(2, '0');
    const min = String(hoy.getMinutes()).padStart(2, '0');
    const ss = String(hoy.getSeconds()).padStart(2, '0');
    const dateStr = `${dd}${mm}${yyyy}`;
    if (countersRef.current.pedidoLastDate !== dateStr) {
      countersRef.current.pedidoLastDate = dateStr;
      countersRef.current.pedidoDayCounter = 0;
    }
    countersRef.current.pedidoDayCounter++;
    const id = `PED-${dd}${mm}${yyyy}${HH}${min}${ss}-${String(countersRef.current.pedidoDayCounter).padStart(4, '0')}`;
    const fStr = hoy.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
    return { id, fStr };
  }

  useEffect(() => {
    cargarClientesGestor().then((stored) => {
      if (stored) {
        setClientes(stored.clientes);
        countersRef.current = stored.counters;
      } else {
        setClientes(getMockClientesInitial());
      }
      setDbLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!dbLoading) {
      guardarDB(clientes, countersRef.current).catch(console.warn);
    }
  }, [clientes, dbLoading]);

  // ─── Incidencias (read-only, synced from PouchDB) ────────
  const [incidencias, setIncidencias] = useState([]);
  const incidenciasRef = useRef([]);
  useEffect(() => { incidenciasRef.current = incidencias; }, [incidencias]);

  useEffect(() => {
    getDoc('cp_v5_incidencias', []).then((saved) => {
      if (saved && Array.isArray(saved)) setIncidencias(saved);
    }).catch(console.warn);
  }, []);

  const clientesRef = useRef([]);
  useEffect(() => { clientesRef.current = clientes; }, [clientes]);

  useEffect(() => {
    const feed = db.changes({ live: true, since: 'now', include_docs: true })
      .on('change', async (change) => {
        if (change.id === 'cp_v5_incidencias' && change.doc?.data) {
          const incoming = JSON.stringify(change.doc.data);
          if (incoming !== JSON.stringify(incidenciasRef.current)) setIncidencias(change.doc.data);
        }
        if ((change.id === 'cp_admin_clientes' || change.id === LS_KEY) && change.doc?.data) {
          try {
            const [adminList, gestorList] = await Promise.all([
              getDoc('cp_admin_clientes', []),
              getDoc(LS_KEY, []),
            ]);
            const merged = mergeGestorClientes(adminList, gestorList);
            if (JSON.stringify(merged) !== JSON.stringify(clientesRef.current)) {
              setClientes(merged);
            }
          } catch (e) { console.warn(e); }
        }
      });
    return () => feed.cancel();
  }, []);

  // Pending count for sidebar badge (both Empleado and Admin formats)
  const incidenciasPendientes = incidencias.filter(i => {
    if (i.resuelta || i.estado === 'resuelta' || i.estado === 'rechazada') return false;
    return true;
  }).length;

  // ─── Navigation ─────────────────────────────────────────
  const location = useLocation();
  const navigate = useNavigate();
  const [clienteActivoId, setClienteActivoId] = useState(null);
  const [pedidoActivoId, setPedidoActivoId] = useState(null);
  // sub-screen only used within /clientes route for drill-down
  const [subScreen, setSubScreen] = useState('clientes');

  const clienteActivo = clientes.find(c => c.id === clienteActivoId) || null;
  const pedidoActivo = clienteActivo?.pedidos.find((p) => p.id === pedidoActivoId) || null;

  // Derive current screen name for topbar breadcrumbs and sidebar highlight
  const screen = location.pathname.startsWith('/confirmaciones')
    ? 'confirmaciones'
    : location.pathname.startsWith('/incidencias')
      ? 'incidencias'
      : subScreen;

  // ─── Nueva Orden form state ──────────────────────────────
  const [esReutilizado, setEsReutilizado] = useState(false);
  const [snapshotOriginal, setSnapshotOriginal] = useState(null);
  const [tipoDiseno, setTipoDiseno] = useState('Nuevo');
  const [prendasSeleccionadas, setPrendasSeleccionadas] = useState([]);
  const [clothesData, setClothesData] = useState([]);
  const [adjuntosData, setAdjuntosData] = useState([]);
  const [areasActivas, setAreasActivas] = useState(null);
  const [areasSecuencia, setAreasSecuencia] = useState([]);
  const [substepActual, setSubstepActual] = useState(1);
  const [maxSubstep, setMaxSubstep] = useState(1);
  const [kitDestino, setKitDestino] = useState(null);
  const [disciplina, setDisciplina] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tipoSolicitud, setTipoSolicitud] = useState('');
  const [observaciones, setObservaciones] = useState('');

  // ─── Modals ─────────────────────────────────────────────
  const [confirmModal, setConfirmModal] = useState(null);
  const [ordenDetalleOrdenId, setOrdenDetalleOrdenId] = useState(null);
  const [actividadesModalAreaIdx, setActividadesModalAreaIdx] = useState(null);
  const [kitOrdenesModalKitId, setKitOrdenesModalKitId] = useState(null);
  const [kitModalVisible, setKitModalVisible] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // ─── Helpers ────────────────────────────────────────────
  function showConfirm({ title, body, confirmLabel, confirmCls, icon, iconCls, onConfirm, hideCancelBtn }) {
    setConfirmModal({ title, body, confirmLabel, confirmCls, icon, iconCls, onConfirm, hideCancelBtn });
  }
  function showAlert(title, body, icon = 'alert-circle') {
    showConfirm({
      title, body,
      confirmLabel: 'Entendido',
      confirmCls: 'bg-[#050314] hover:bg-gray-800 text-white',
      icon, iconCls: 'bg-gray-100',
      hideCancelBtn: true,
      onConfirm: () => { },
    });
  }

  function updateCliente(clienteId, updater) {
    setClientes(prev => prev.map(c => c.id === clienteId ? updater(c) : c));
  }
  function updatePedido(clienteId, pedidoId, updater) {
    updateCliente(clienteId, c => ({
      ...c,
      pedidos: c.pedidos.map((p) => p.id === pedidoId ? updater(p) : p),
    }));
  }

  function goTo(screenName) {
    // For sidebar-level screens, use router navigate
    if (screenName === 'confirmaciones') { navigate('/confirmaciones'); return; }
    if (screenName === 'incidencias') { navigate('/incidencias'); return; }
    // For client drill-down sub-screens, stay in /clientes and use subScreen state
    if (screenName === 'clientes') { navigate('/clientes'); setSubScreen('Clientes'); window.scrollTo(0, 0); return; }
    setSubScreen(screenName);
    window.scrollTo(0, 0);
  }

  // ─── SCREEN: CLIENTES ───────────────────────────────────
  function verPedidos(clienteId) {
    setClienteActivoId(clienteId);
    goTo('pedidos');
  }
  function crearPedidoDesdeCliente(clienteId) {
    setClienteActivoId(clienteId);
    crearPedidoNuevo(clienteId);
  }

  async function onCrearCliente(data) {
    const newId = crypto.randomUUID();
    const fechaRegistro = new Date().toISOString().split('T')[0];

    const adminCliente = {
      id: newId,
      nombre: data.nombre,
      vendor: data.vendor || '',
      informacion: data.informacion || '',
      fechaRegistro,
    };

    const gestorCliente = {
      id: newId,
      nombre: data.nombre,
      vendor: data.vendor || '',
      informacion: data.informacion || '',
      telefono: data.informacion || '',
      ultimoPedido: 'Sin pedidos',
      totalPedidos: 0,
      pedidos: [],
    };

    try {
      const adminList = await getDoc('cp_admin_clientes', []);
      await setDoc('cp_admin_clientes', [...adminList, adminCliente]);
      const listaActualizada = [...clientes, gestorCliente];
      setClientes(listaActualizada);
    } catch (e) {
      console.warn('Error al registrar cliente', e);
    }
  }

  // ─── SCREEN: PEDIDOS ────────────────────────────────────
  function crearPedidoNuevo(forClienteId) {
    const cid = forClienteId || clienteActivoId;
    const cl = clientes.find(c => c.id === cid);
    showConfirm({
      title: 'Crear nuevo pedido',
      body: `Se creará un pedido vacío para ${cl?.nombre || 'el cliente'}. Podrás agregar órdenes y kits después.`,
      confirmLabel: 'Crear pedido',
      confirmCls: 'bg-[#050314] hover:bg-gray-800 text-white',
      icon: 'package', iconCls: 'bg-gray-100',
      onConfirm: () => _ejecutarCrearPedido(cid),
    });
  }
  function _ejecutarCrearPedido(cid) {
    const { id: idStr, fStr } = generarNuevoPedidoId();
    const nuevoPedido = { id: idStr, fecha: fStr, fechaLimite: '', status: 'En progreso', confirmado: false, adjuntos: [], kits: [], ordenes: [] };
    setClientes(prev => prev.map(c => {
      if (c.id !== cid) return c;
      return { ...c, pedidos: [nuevoPedido, ...c.pedidos], totalPedidos: c.totalPedidos + 1, ultimoPedido: fStr };
    }));
    setClienteActivoId(cid);
    setPedidoActivoId(idStr);
    goTo('detalle-pedido');
  }

  // ─── SCREEN: DETALLE PEDIDO ─────────────────────────────
  function verDetallePedido(pedidoId) {
    setPedidoActivoId(pedidoId);
    goTo('detalle-pedido');
  }
  function guardarFechaLimite(val) {
    updatePedido(clienteActivoId, pedidoActivoId, p => ({ ...p, fechaLimite: val }));
  }
  function confirmarPedido() {
    if (!pedidoActivo?.fechaLimite || pedidoActivo.fechaLimite.trim() === '') {
      showAlert('Fecha requerida', 'Debes ingresar una fecha límite antes de confirmar el pedido.', 'calendar');
      return;
    }
    if (!pedidoActivo?.ordenes.length) {
      showAlert('Pedido vacío', 'El pedido debe tener al menos una orden antes de confirmarse.', 'alert-circle');
      return;
    }
    showConfirm({
      title: 'Confirmar pedido',
      body: 'Al confirmar, el pedido pasará a estado En producción. Aún podrás agregar órdenes y kits mientras la fecha límite esté vigente',
      confirmLabel: 'Confirmar pedido',
      confirmCls: 'bg-green-600 hover:bg-green-700 text-white',
      icon: 'check-circle', iconCls: 'bg-green-100',
      onConfirm: () => {
        updatePedido(clienteActivoId, pedidoActivoId, p => ({
          ...p,
          confirmado: true,
          status: 'En producción',
          ordenes: p.ordenes.map((o) => ({ ...o, status: 'En producción' })),
          kits: p.kits.map((k) => ({ ...k, status: 'En producción' })),
        }));
      },
    });
  }
  function eliminarPedidoActivo() {
    const p = pedidoActivo;
    if (!p) return;
    if (p.confirmado) return;
    showConfirm({
      title: 'Eliminar pedido',
      body: `¿Eliminar el pedido ${p.id}? Esta acción no se puede deshacer.`,
      confirmLabel: 'Eliminar',
      confirmCls: 'bg-red-600 hover:bg-red-700 text-white',
      icon: 'trash-2', iconCls: 'bg-red-100',
      onConfirm: () => {
        updateCliente(clienteActivoId, c => ({
          ...c,
          pedidos: c.pedidos.filter((ped) => ped.id !== pedidoActivoId),
          totalPedidos: Math.max(0, c.totalPedidos - 1),
        }));
        setPedidoActivoId(null);
        goTo('pedidos');
      },
    });
  }

  function eliminarOrden(ordenId) {
    updatePedido(clienteActivoId, pedidoActivoId, p => ({
      ...p,
      ordenes: p.ordenes.filter((o) => o.id !== ordenId),
      kits: p.kits.map((k) => ({
        ...k,
        ordenIds: k.ordenIds.filter((id) => id !== ordenId)
      }))
    }));
  }

  function guardarPrendasOrden(ordenId, nuevasClothes) {
    updatePedido(clienteActivoId, pedidoActivoId, p => ({
      ...p,
      ordenes: p.ordenes.map((o) => o.id === ordenId ? { ...o, clothes: nuevasClothes } : o),
    }));
  }

  // ─── ADJUNTOS PEDIDO ────────────────────────────────────
  function handleAdjuntosPedido(event) {
    const files = Array.from(event.target.files);
    if (!files.length) return;
    let pending = files.length;
    const nuevos = [];
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        nuevos.push({ id: 'ADJ-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6), nombre: f.name, type: f.type, size: f.size, dataUrl: e.target.result });
        pending--;
        if (pending === 0) {
          updatePedido(clienteActivoId, pedidoActivoId, p => ({ ...p, adjuntos: [...p.adjuntos, ...nuevos] }));
        }
      };
      reader.readAsDataURL(f);
    });
    event.target.value = '';
  }

  function quitarAdjunto(idx, scope) {
    if (scope === 'pedido' || scope === 'pedido-readonly') {
      updatePedido(clienteActivoId, pedidoActivoId, p => ({ ...p, adjuntos: p.adjuntos.filter((_, i) => i !== idx) }));
    } else {
      setAdjuntosData(prev => prev.filter((_, i) => i !== idx));
    }
  }

  // ─── KITS ───────────────────────────────────────────────
  function abrirModalKit() {
    const p = pedidoActivo;
    if (p && pedidoVencido(p)) {
      showAlert('Pedido bloqueado', 'La fecha límite venció. No se pueden agregar más kits.', 'lock');
      return;
    }
    setKitModalVisible(true);
  }
  function confirmarNuevoKit(nombre) {
    setKitModalVisible(false);
    showConfirm({
      title: 'Crear kit',
      body: `Se creará el kit "${nombre}" en este pedido.`,
      confirmLabel: 'Crear kit',
      confirmCls: 'bg-[#050314] hover:bg-gray-800 text-white',
      icon: 'layers', iconCls: 'bg-purple-100',
      onConfirm: () => {
        const hoy = new Date();
        const fStr = hoy.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
        updatePedido(clienteActivoId, pedidoActivoId, p => ({
          ...p, kits: [...p.kits, { id: 'KIT-' + Date.now(), nombre, fecha: fStr, ordenIds: [], status: p.confirmado ? 'En producción' : undefined }],
        }));
      },
    });
  }
  function eliminarKit(kitId) {
    const p = pedidoActivo;
    const kit = p?.kits.find((k) => k.id === kitId);
    if (!kit) return;
    if (kit.ordenIds.length > 0) {
      showAlert('Kit con órdenes', 'Solo se pueden eliminar kits vacíos.', 'alert-circle');
      return;
    }
    showConfirm({
      title: 'Eliminar kit',
      body: `¿Eliminar el kit "${kit.nombre}"?`,
      confirmLabel: 'Eliminar',
      confirmCls: 'bg-red-600 hover:bg-red-700 text-white',
      icon: 'trash-2', iconCls: 'bg-red-100',
      onConfirm: () => {
        updatePedido(clienteActivoId, pedidoActivoId, p => ({ ...p, kits: p.kits.filter((k) => k.id !== kitId) }));
      },
    });
  }
  function quitarOrdenDeKit(ordenId, kitId) {
    const p = pedidoActivo;
    const kit = p?.kits.find((k) => k.id === kitId);
    if (!kit) return;
    showConfirm({
      title: 'Quitar orden del kit',
      body: `¿Quitar la orden ${ordenId} del kit "${kit.nombre}"? La orden seguirá existiendo en el pedido.`,
      confirmLabel: 'Quitar del kit',
      confirmCls: 'bg-red-600 hover:bg-red-700 text-white',
      icon: 'minus-circle', iconCls: 'bg-red-100',
      onConfirm: () => {
        updatePedido(clienteActivoId, pedidoActivoId, p => ({
          ...p,
          kits: p.kits.map((k) => k.id === kitId ? { ...k, ordenIds: k.ordenIds.filter((id) => id !== ordenId) } : k),
        }));
      },
    });
  }
  function abrirModalOrdenesKit(kitId) {
    setKitOrdenesModalKitId(kitId);
  }
  function confirmarAgregarOrdenesKit(kitId, selectedOrdenIds) {
    const p = pedidoActivo;
    if (p && pedidoVencido(p)) {
      setKitOrdenesModalKitId(null);
      showAlert('Pedido bloqueado', 'La fecha límite venció.', 'lock');
      return;
    }
    updatePedido(clienteActivoId, pedidoActivoId, p => ({
      ...p,
      kits: p.kits.map((k) => {
        if (k.id === kitId) {
          const newIds = [...k.ordenIds];
          selectedOrdenIds.forEach((id) => { if (!newIds.includes(id)) newIds.push(id); });
          return { ...k, ordenIds: newIds };
        }
        return { ...k, ordenIds: k.ordenIds.filter((id) => !selectedOrdenIds.includes(id)) };
      }),
    }));
    setKitOrdenesModalKitId(null);
  }

  // ─── NUEVA ORDEN ────────────────────────────────────────
  async function computeBaseAreas() {
    try {
      const areasGuardadas = await getDoc('cp_areas', []);
      if (areasGuardadas && areasGuardadas.length > 0) {
        return areasGuardadas
          .filter(area => area.nombre !== 'Gestión de Ordenes' && area.nombre !== 'Atención a Clientes' && area.estado !== 'inactiva')
          .map(area => ({ id: area.id, nombre: area.nombre, color: area.color || '#6b7280', activa: false, actividades: [] }));
      }
    } catch (error) {
      console.error('computeBaseAreas:', error);
    }
    return areasConfig.map((a) => ({ ...a, activa: false, actividades: [] }));
  }

  async function computeActividadesCatalog() {
    try {
      const guardadas = await getDoc('cp_v5_actividades', []);
      if (guardadas && guardadas.length > 0) return guardadas;
    } catch (error) {
      console.error('computeActividadesCatalog:', error);
    }
    return defaultActividades;
  }

  async function iniciarNuevaOrden() {
    const p = pedidoActivo;
    if (p && pedidoVencido(p)) {
      showAlert('Pedido bloqueado', 'La fecha límite venció.');
      return;
    }
    setKitDestino(null);
    const baseAreas = await computeBaseAreas();
    initNuevaOrden(false, undefined, baseAreas);
    goTo('nueva-orden');
  }

  async function crearOrdenParaKit(kitId) {
    const p = pedidoActivo;
    if (p && pedidoVencido(p)) {
      showAlert('Pedido bloqueado', 'La fecha límite venció.');
      return;
    }
    setKitDestino(kitId);
    const baseAreas = await computeBaseAreas();
    initNuevaOrden(false, undefined, baseAreas);
    goTo('nueva-orden');
  }

  async function reutilizarOrden(ordenId, kitId) {
    const p = pedidoActivo;
    if (p && pedidoVencido(p)) {
      showAlert('Pedido bloqueado', 'La fecha límite venció.');
      return;
    }
    setKitDestino(kitId ?? null);
    const baseAreas = await computeBaseAreas();
    const actividadesCatalog = await computeActividadesCatalog();
    initNuevaOrden(true, ordenId, baseAreas, actividadesCatalog);
    goTo('nueva-orden');
  }

  function initNuevaOrden(reutilizar, ordenId, baseAreas, actividadesCatalog) {
    if (!pedidoActivo && !pedidoActivoId) return;
    const p = clientes.find(c => c.id === clienteActivoId)?.pedidos.find((p) => p.id === pedidoActivoId);
    if (!p) return;
    const orden = reutilizar ? (ordenId ? p.ordenes.find((o) => o.id === ordenId) : p.ordenes[0]) : null;
    const areasBase = baseAreas || areasConfig.map((a) => ({ ...a, activa: false, actividades: [] }));

    const newPrendas = reutilizar
      ? (orden?.clothes?.map((c) => c.name).filter((v, i, a) => a.indexOf(v) === i) || [])
      : [];
    setPrendasSeleccionadas(newPrendas);
    setClothesData(
      reutilizar && orden?.clothes
        ? JSON.parse(JSON.stringify(orden.clothes)).map((c, i) => ({ ...c, id: `c${Date.now()}-${i}` }))
        : []
    );
    const adjuntosOrdenOriginal = reutilizar && orden?.adjuntos
      ? JSON.parse(JSON.stringify(orden.adjuntos)).map((a, i) => ({ ...a, id: `ADJ-${Date.now()}-${i}` }))
      : [];

    if (reutilizar) {
      setAdjuntosData(adjuntosOrdenOriginal);
    } else {
      setAdjuntosData(p ? [...(p.adjuntos || [])] : []);
    }

    if (reutilizar && orden?.config?.areas?.length) {
      setAreasActivas(areasBase.map((a) => {
        const savedArea = orden.config.areas.find((sa) => sa.area === a.nombre);
        if (savedArea) {
          const actividades = savedArea.actividades.map((sa) => {
            const def = (actividadesCatalog || []).find((c) => c.nombre === sa.actividad) || getCatalogoActividad(sa.actividad);
            if (!def) return null;
            return { ...JSON.parse(JSON.stringify(def)), selectedOptions: sa.tags?.map((t) => t.opcion) || [] };
          }).filter(Boolean);
          return { ...a, activa: true, actividades };
        }
        return { ...a, activa: false, actividades: [] };
      }));
      setAreasSecuencia(
        orden.config.areas
          .map((sa) => sa.area)
          .filter((nombre) => areasBase.some((a) => a.nombre === nombre))
      );
    } else {
      setAreasActivas(areasBase);
      setAreasSecuencia([]);
    }
    setEsReutilizado(reutilizar);
    setTipoDiseno(reutilizar ? 'Pasado' : 'Nuevo');
    setSnapshotOriginal(reutilizar ? { disciplina: orden?.disciplina || '', prendas: newPrendas.slice().sort().join(',') } : null);
    setSubstepActual(1);
    setMaxSubstep(1);
    setDisciplina(reutilizar ? (orden?.disciplina || '') : '');
    setCategoria(reutilizar ? (orden?.categoria || '') : '');
    setTipoSolicitud(reutilizar ? (orden?.tipoSolicitud || '') : '');
    setObservaciones(reutilizar ? (orden?.observaciones || '') : '');
  }

  function goSubstep(n) {
    const newMax = Math.max(maxSubstep, n);
    setMaxSubstep(newMax);
    setSubstepActual(n);
    window.scrollTo(0, 0);
  }
  function goSubstepNav(n) {
    goSubstep(n);
  }

  function salirNuevaOrden() {
    const tieneDatos = clothesData.length > 0
      || (areasActivas && areasActivas.some(a => a.activa))
      || disciplina.trim();
    if (tieneDatos) {
      showConfirm({
        title: 'Descartar cambios',
        body: 'Tienes información capturada. ¿Salir y descartar los cambios?',
        confirmLabel: 'Salir y descartar',
        confirmCls: 'bg-red-600 hover:bg-red-700 text-white',
        icon: 'alert-triangle', iconCls: 'bg-yellow-100',
        onConfirm: () => { setKitDestino(null); goTo('detalle-pedido'); },
      });
    } else {
      setKitDestino(null);
      goTo('detalle-pedido');
    }
  }

  function confirmarOrden() {
    const p = pedidoActivo;
    if (p && pedidoVencido(p)) {
      showAlert('Pedido vencido', 'La fecha límite ya venció. No se puede confirmar la orden.', 'lock');
      return;
    }
    if (!clothesData.length) {
      showAlert('Sin prendas', 'Debes agregar al menos una prenda antes de confirmar la orden.', 'shirt');
      return;
    }
    const faltantes = [];
    if (!disciplina.trim()) faltantes.push('Disciplina');
    if (!categoria) faltantes.push('Calidad de producto');
    if (!tipoSolicitud.trim()) faltantes.push('Tipo de solicitud');
    if (faltantes.length) {
      showAlert('Información incompleta', `Completa los campos obligatorios: ${faltantes.join(', ')}.`, 'alert-circle');
      return;
    }
    showConfirm({
      title: 'Confirmar orden',
      body: `La orden quedará como En progreso en el pedido ${pedidoActivo?.id}. Verifica el resumen antes de continuar.`,
      confirmLabel: 'Confirmar orden',
      confirmCls: 'bg-[#050314] hover:bg-gray-800 text-white',
      icon: 'check-circle', iconCls: 'bg-gray-100',
      onConfirm: _ejecutarConfirmarOrden,
    });
  }

  function _ejecutarConfirmarOrden() {
    countersRef.current.ordenIdCounter++;
    const displayId = generarOrdenDisplayId(countersRef.current.ordenIdCounter);
    const internalCode = generarOrdenInternalCode(displayId, disciplina, tipoSolicitud);
    const tipoSol = tipoSolicitudLimpio(tipoSolicitud);
    const p = pedidoActivo;
    const areasOrdenadas = areasSecuencia.length > 0
      ? areasSecuencia.map((nombre) => (areasActivas || []).find((a) => a.nombre === nombre && a.activa)).filter(Boolean)
      : (areasActivas || []).filter((a) => a.activa);
    const nuevaOrden = {
      id: displayId,
      code: internalCode,
      status: p?.confirmado ? 'En producción' : 'En progreso',
      disciplina,
      categoria,
      tipoSolicitud: tipoSol,
      tipoDiseno,
      observaciones,
      config: {
        areas: areasOrdenadas.map((a) => ({
          area: a.nombre,
          actividades: a.actividades.map((act) => ({
            actividad: act.nombre,
            tags: (act.selectedOptions || []).map((op) => ({ opcion: op })),
          })),
        })),
      },
      clothes: JSON.parse(JSON.stringify(clothesData)),
      adjuntos: [...adjuntosData],
    };
    const currentKitDestino = kitDestino;
    updatePedido(clienteActivoId, pedidoActivoId, ped => {
      const newOrdenes = [...ped.ordenes, nuevaOrden];
      let newKits = ped.kits;
      if (currentKitDestino) {
        newKits = ped.kits.map((k) =>
          k.id === currentKitDestino && !k.ordenIds.includes(nuevaOrden.id)
            ? { ...k, ordenIds: [...k.ordenIds, nuevaOrden.id] }
            : k
        );
      }
      return { ...ped, ordenes: newOrdenes, kits: newKits };
    });
    setKitDestino(null);
    goTo('detalle-pedido');
  }

  // ─── ADJUNTOS ORDEN ─────────────────────────────────────
  function handleAdjuntos(event) {
    const files = Array.from(event.target.files);
    if (!files.length) return;
    let pending = files.length;
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const obj = { id: 'ADJ-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6), nombre: f.name, type: f.type, size: f.size, dataUrl: e.target.result };
        setAdjuntosData(prev => [...prev, obj]);
        pending--;
      };
      reader.readAsDataURL(f);
    });
    event.target.value = '';
  }

  function verDetalleOrden(ordenId) {
    setOrdenDetalleOrdenId(ordenId);
  }

  function restablecerDatos() {
    showConfirm({
      title: 'Restablecer datos',
      body: 'Se borrarán todos los cambios guardados y se cargarán los datos iniciales. Esta acción no se puede deshacer.',
      confirmLabel: 'Restablecer',
      confirmCls: 'bg-red-600 hover:bg-red-700 text-white',
      icon: 'rotate-ccw', iconCls: 'bg-red-100',
      onConfirm: async () => {
        await deleteDoc(LS_KEY);
        await deleteDoc(LS_KEY_OIDS);
        location.reload();
      },
    });
  }

  function abrirModalActividades(areaIdx) {
    setActividadesModalAreaIdx(areaIdx);
  }

  function confirmarAgregarActividades(areaIdx, actividadesSeleccionadas) {
    setAreasActivas(prev => (prev || []).map((a, i) => {
      if (i !== areaIdx) return a;
      const nuevas = actividadesSeleccionadas
        .map((actividadReal) => {
          if (a.actividades.some((act) => act.nombre === actividadReal.nombre)) return null;
          return { ...JSON.parse(JSON.stringify(actividadReal)), selectedOptions: [] };
        })
        .filter(Boolean);
      return { ...a, actividades: [...a.actividades, ...nuevas] };
    }));
    setActividadesModalAreaIdx(null);
  }

  if (dbLoading) return null;

  // ─── Clientes sub-screen renderer ────────────────────────────────────────
  function renderClientesSubScreen() {
    if (subScreen === 'pedidos') {
      return (
        <PedidosScreen
          clienteActivo={clienteActivo}
          onGoTo={goTo}
          onCrearPedidoNuevo={() => crearPedidoNuevo()}
          onVerDetallePedido={verDetallePedido}
        />
      );
    }
    if (subScreen === 'detalle-pedido') {
      return (
        <DetallePedidoScreen
          pedidoActivo={pedidoActivo}
          clienteActivo={clienteActivo}
          onGoTo={goTo}
          onVerDetalleOrden={verDetalleOrden}
          onIniciarNuevaOrden={iniciarNuevaOrden}
          onAbrirModalKit={abrirModalKit}
          onAbrirModalOrdenesKit={abrirModalOrdenesKit}
          onCrearOrdenParaKit={crearOrdenParaKit}
          onEliminarKit={eliminarKit}
          onQuitarOrdenDeKit={quitarOrdenDeKit}
          onEliminarPedidoActivo={eliminarPedidoActivo}
          onConfirmarPedido={confirmarPedido}
          onGuardarFechaLimite={guardarFechaLimite}
          onHandleAdjuntosPedido={handleAdjuntosPedido}
          onQuitarAdjunto={quitarAdjunto}
          onEliminarOrden={eliminarOrden}
          onReutilizarOrden={reutilizarOrden}
        />
      );
    }
    if (subScreen === 'nueva-orden') {
      return (
        <NuevaOrdenScreen
          pedidoActivo={pedidoActivo}
          kitDestino={kitDestino}
          esReutilizado={esReutilizado}
          tipoDiseno={tipoDiseno}
          setTipoDiseno={setTipoDiseno}
          prendasSeleccionadas={prendasSeleccionadas}
          setPrendasSeleccionadas={setPrendasSeleccionadas}
          clothesData={clothesData}
          setClothesData={setClothesData}
          adjuntosData={adjuntosData}
          areasActivas={areasActivas}
          setAreasActivas={setAreasActivas}
          areasSecuencia={areasSecuencia}
          setAreasSecuencia={setAreasSecuencia}
          substepActual={substepActual}
          maxSubstep={maxSubstep}
          disciplina={disciplina}
          setDisciplina={setDisciplina}
          categoria={categoria}
          setCategoria={setCategoria}
          tipoSolicitud={tipoSolicitud}
          setTipoSolicitud={setTipoSolicitud}
          observaciones={observaciones}
          setObservaciones={setObservaciones}
          snapshotOriginal={snapshotOriginal}
          onSalirNuevaOrden={salirNuevaOrden}
          onConfirmarOrden={confirmarOrden}
          onAbrirModalActividades={abrirModalActividades}
          onHandleAdjuntos={handleAdjuntos}
          onQuitarAdjunto={quitarAdjunto}
          onGoSubstep={goSubstep}
          onGoSubstepNav={goSubstepNav}
          onShowAlert={showAlert}
        />
      );
    }
    // Default: Clientes
    return (
      <ClientesScreen
        clientes={clientes}
        onVerPedidos={verPedidos}
        onCrearPedidoDesdeCliente={crearPedidoDesdeCliente}
        onCrearCliente={onCrearCliente}
      />
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-gray-900 font-sans">
      {onLogout && (
        <Sidebar
          title="Gestión de Órdenes"
          subtitle="Sistema de Gestión"
          menuItems={[
            { id: 'clientes', label: 'Clientes', icon: UserCircle, path: '/clientes' },
            { id: 'confirmaciones', label: 'Confirmaciones', icon: ClipboardCheck, path: '/confirmaciones' },
            { id: 'incidencias', label: 'Incidencias', icon: AlertTriangle, path: '/incidencias', badge: incidenciasPendientes }
          ]}
          user={{
            initials: user?.nombre?.charAt(0).toUpperCase() || 'G',
            name: user?.email || 'gestor@uniformespro.com',
            role: user?.nombre || 'Gestor'
          }}
          onLogout={() => setIsLogoutModalOpen(true)}
        />
      )}

      <div className="flex flex-col flex-1 min-w-0 h-screen md:h-auto overflow-y-auto md:overflow-visible">
        <Topbar
          screen={screen}
          clienteActivo={clienteActivo}
          pedidoActivo={pedidoActivo}
          onGoTo={goTo}
          onRestablecerDatos={restablecerDatos}
        />

        <div className="flex-1 py-8 px-8 max-w-6xl w-full mx-auto">
          <Routes>
            <Route path="/clientes" element={renderClientesSubScreen()} />
            <Route path="/confirmaciones" element={<ConfirmacionesMaterial />} />
            <Route path="/incidencias" element={<IncidenciasGestorScreen incidencias={incidencias} />} />
            <Route path="/" element={<Navigate to="/clientes" replace />} />
            <Route path="*" element={<Navigate to="/clientes" replace />} />
          </Routes>
        </div>

        {/* Modals */}
        {confirmModal && (
          <ConfirmModal data={confirmModal} onClose={() => setConfirmModal(null)} />
        )}
        <OrdenDetalleModal
          visible={!!ordenDetalleOrdenId}
          ordenId={ordenDetalleOrdenId}
          pedidoActivo={pedidoActivo}
          onClose={() => setOrdenDetalleOrdenId(null)}
          onGuardarPrendasOrden={guardarPrendasOrden}
        />
        <ActividadesModal
          visible={actividadesModalAreaIdx !== null}
          areaIdx={actividadesModalAreaIdx}
          areasActivas={areasActivas}
          onClose={() => setActividadesModalAreaIdx(null)}
          onConfirmar={confirmarAgregarActividades}
        />
        <KitModal
          visible={kitModalVisible}
          onClose={() => setKitModalVisible(false)}
          onConfirm={confirmarNuevoKit}
        />
        <KitOrdenesModal
          visible={!!kitOrdenesModalKitId}
          kitId={kitOrdenesModalKitId}
          pedidoActivo={pedidoActivo}
          onClose={() => setKitOrdenesModalKitId(null)}
          onConfirmar={confirmarAgregarOrdenesKit}
        />
      </div>

      {/* MODAL LOGOUT */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => onLogout?.()}
      />
    </div>
  );
}