import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Topbar from '@/modules/auth/preConfig/pages/TopBar';
import ClientesScreen from '@/modules/auth/preConfig/clientes/pages/ClientesScreen';
import PedidosScreen from '@/modules/auth/preConfig/pedidos/pages/PedidosScreen';
import DetallePedidoScreen from '@/modules/auth/preConfig/pedidos/pages/DetallePedidoScreen';
import NuevaOrdenScreen from '@/modules/auth/preConfig/orders/pages/NuevaOrdenScreen';
import IncidenciasGestorScreen from '@/modules/auth/preConfig/incidencias/pages/IncidenciasGestorScreen';
import ConfirmModal from '@/modules/auth/preConfig/shared/components/ConfirmModal';
import OrdenDetalleModal from '@/modules/auth/preConfig/orders/components/OrdenDetalleModal';
import ActividadesModal from '@/modules/auth/preConfig/orders/components/ActividadesModal';
import KitModal from '@/modules/auth/preConfig/shared/components/KitModal';
import KitOrdenesModal from '@/modules/auth/preConfig/shared/components/KitOrdenesModal';
import LogoutModal from '@/kernel/components/LogoutModal';
import {
  getMockClientesInitial, guardarDB, cargarClientesGestor, mergeGestorClientes,
  areasConfig, getCatalogoActividad, defaultActividades,
  LS_KEY,
} from '@/modules/auth/preConfig/data/catalogos';
import { getDoc } from '@/modules/auth/preConfig/app/storage';
import { db } from '@/modules/auth/preConfig/app/db';
import { Sidebar } from './Sidebar';
import { UserCircle, ClipboardCheck, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/kernel/context/AuthContext';
import { ConfirmacionesMaterial } from '@/modules/auth/initialConfig/materialCheck/pages/ConfirmacionesMaterial';
import {
  pedidoVencido, tipoSolicitudLimpio,
  generarOrdenDisplayId, generarOrdenInternalCode,
} from '@/modules/auth/preConfig/utils/helpers';
import ClientesService from '@/modules/auth/initialConfig/clientes/services/ClientesService';
import IncidenciasService from '@/modules/auth/initialConfig/incidents/services/IncidenciasService';
import PedidosService from '@/modules/auth/preConfig/pedidos/services/PedidosService';

export default function OrderManagerLayout({ onLogout = null }) {
  const { user } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);
  const countersRef = useRef({ ordenIdCounter: 10, pedidoIdCounter: 60, pedidoLastDate: '', pedidoDayCounter: 0 });

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

  const fetchClientesData = async () => {
    try {
      setDbLoading(true);
      const response = await ClientesService.getAll();
      const list = Array.isArray(response?.content)
        ? response.content
        : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];

      const normalized = list.map(c => ({
        id: c.id,
        nombre: c.nombre,
        vendor: c.vendor || c.representante || '',
        informacion: c.informacion || '',
        telefono: c.telefono || '',
        ultimoPedido: c.ultimoPedido || 'Sin pedidos',
        totalPedidos: c.totalPedidos || (c.pedidos ? c.pedidos.length : 0),
        pedidos: c.pedidos || []
      }));
      setClientes(normalized);
    } catch (e) {
      console.warn('Error al cargar clientes desde backend API:', e);
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    fetchClientesData();
  }, []);

  const [incidencias, setIncidencias] = useState([]);

  useEffect(() => {
    IncidenciasService.getAll()
      .then((res) => {
        const list = Array.isArray(res) ? res : (res?.data || res?.content || []);
        if (list.length > 0) setIncidencias(list);
      })
      .catch(console.warn);
  }, []);

  const incidenciasPendientes = incidencias.filter(i => {
    if (i.resuelta || i.estado === 'resuelta' || i.estado === 'rechazada') return false;
    return true;
  }).length;

  const location = useLocation();
  const navigate = useNavigate();
  const [clienteActivoId, setClienteActivoId] = useState(null);
  const [pedidoActivoId, setPedidoActivoId] = useState(null);
  const [subScreen, setSubScreen] = useState('clientes');

  const clienteActivo = clientes.find(c => c.id === clienteActivoId) || null;
  const pedidoActivo = clienteActivo?.pedidos.find((p) => p.id === pedidoActivoId) || null;

  const screen = location.pathname.startsWith('/confirmaciones')
    ? 'confirmaciones'
    : location.pathname.startsWith('/incidencias')
      ? 'incidencias'
      : subScreen;

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

  const [confirmData, setConfirmData] = useState(null);
  const [kitModalVisible, setKitModalVisible] = useState(false);
  const [kitOrdModalVisible, setKitOrdModalVisible] = useState(false);
  const [kitOrdTargetId, setKitOrdTargetId] = useState(null);
  const [actModalVisible, setActModalVisible] = useState(false);
  const [actModalAreaIdx, setActModalAreaIdx] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const [ordenDetalleVisible, setOrdenDetalleVisible] = useState(false);
  const [ordenDetalleId, setOrdenDetalleId] = useState(null);

  function resetNuevaOrdenForm() {
    setEsReutilizado(false);
    setSnapshotOriginal(null);
    setTipoDiseno('Nuevo');
    setPrendasSeleccionadas([]);
    setClothesData([]);
    setAdjuntosData([]);
    setAreasActivas(null);
    setAreasSecuencia([]);
    setSubstepActual(1);
    setMaxSubstep(1);
    setKitDestino(null);
    setDisciplina('');
    setCategoria('');
    setTipoSolicitud('');
    setObservaciones('');
  }

  function handleGoTo(targetScreen) {
    if (location.pathname !== '/clientes') {
      navigate('/clientes');
    }
    setSubScreen(targetScreen);
  }

  function handleVerPedidos(cid) {
    setClienteActivoId(cid);
    setSubScreen('pedidos');
  }

  function handleVerDetallePedido(pid) {
    setPedidoActivoId(pid);
    setSubScreen('detalle-pedido');
  }

  async function handleCrearCliente(data) {
    try {
      const payload = {
        id: crypto.randomUUID(),
        nombre: data.nombre,
        vendor: data.vendor,
        informacion: data.informacion,
        fechaRegistro: new Date().toISOString().split('T')[0],
      };
      await ClientesService.create(payload);
      fetchClientesData();
    } catch (e) {
      console.warn('Fallback al crear cliente localmente:', e);
      const newId = `CLI-${String(Date.now()).slice(-4)}`;
      const newClient = {
        id: newId,
        nombre: data.nombre,
        vendor: data.vendor,
        informacion: data.informacion,
        telefono: '',
        ultimoPedido: 'Sin pedidos',
        totalPedidos: 0,
        pedidos: []
      };
      setClientes(prev => [newClient, ...prev]);
    }
  }

  function handleCrearPedidoDesdeCliente(cid) {
    const { id: newId, fStr } = generarNuevoPedidoId();
    const newPed = {
      id: newId,
      fecha: fStr,
      status: 'Borrador',
      confirmado: false,
      fechaLimite: '',
      ordenes: [],
      kits: [],
      adjuntos: []
    };

    setClientes(prev => prev.map(c => {
      if (c.id === cid) {
        return {
          ...c,
          totalPedidos: (c.totalPedidos || 0) + 1,
          ultimoPedido: fStr,
          pedidos: [newPed, ...c.pedidos]
        };
      }
      return c;
    }));

    setClienteActivoId(cid);
    setPedidoActivoId(newId);
    setSubScreen('detalle-pedido');
  }

  function handlePedirCrearPedido(cid) {
    const targetCid = cid || clienteActivoId;
    const c = clientes.find(client => client.id === targetCid) || clienteActivo;
    if (!c) return;
    setConfirmData({
      title: 'Crear nuevo pedido',
      body: `Se creará un pedido vacío para ${c.nombre}. Podrás agregar órdenes y kits después.`,
      confirmLabel: 'Crear pedido',
      confirmCls: 'bg-[#050314] text-white hover:bg-gray-800',
      icon: 'package',
      iconCls: 'bg-gray-100',
      onConfirm: () => handleCrearPedidoDesdeCliente(c.id)
    });
  }

  function handleCrearPedidoNuevo() {
    if (!clienteActivoId) return;
    handlePedirCrearPedido(clienteActivoId);
  }

  const managementUser = {
    initials: user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'M',
    role: 'Gestor de Órdenes',
    name: user?.email || 'gestor@uniformespro.com'
  };

  const menuItems = [
    { id: 'clientes', label: 'Gestión de Equipos', icon: UserCircle, path: '/clientes' },
    { id: 'confirmaciones', label: 'Confirmaciones de Material', icon: ClipboardCheck, path: '/confirmaciones' },
    { id: 'incidencias', label: 'Incidencias', icon: AlertTriangle, path: '/incidencias', badge: incidenciasPendientes > 0 ? incidenciasPendientes : null },
  ];

  return (
    <div className="flex h-screen bg-background flex-col md:flex-row">
      <Sidebar
        title="UniformesPro"
        subtitle="Gestión de Órdenes"
        menuItems={menuItems}
        user={managementUser}
        onLogout={() => setIsLogoutModalOpen(true)}
      />

      <main className="flex-1 overflow-y-auto">
        {screen !== 'confirmaciones' && screen !== 'incidencias' && (
          <Topbar
            screen={screen}
            clienteActivo={clienteActivo}
            pedidoActivo={pedidoActivo}
            onGoTo={handleGoTo}
          />
        )}

        {location.pathname === '/confirmaciones' && <ConfirmacionesMaterial />}
        {location.pathname === '/incidencias' && <IncidenciasGestorScreen incidencias={incidencias} />}

        {location.pathname === '/clientes' && (
          <>
            {screen === 'clientes' && (
              <ClientesScreen
                clientes={clientes}
                onVerPedidos={handleVerPedidos}
                onCrearPedidoDesdeCliente={handlePedirCrearPedido}
                onCrearCliente={handleCrearCliente}
              />
            )}

            {screen === 'pedidos' && (
              <PedidosScreen
                clienteActivo={clienteActivo}
                onGoTo={handleGoTo}
                onCrearPedidoNuevo={handleCrearPedidoNuevo}
                onVerDetallePedido={handleVerDetallePedido}
              />
            )}

            {screen === 'detalle-pedido' && (
              <DetallePedidoScreen
                pedidoActivo={pedidoActivo}
                clienteActivo={clienteActivo}
                onGoTo={handleGoTo}
                onVerDetalleOrden={(oid) => { setOrdenDetalleId(oid); setOrdenDetalleVisible(true); }}
                onIniciarNuevaOrden={() => { resetNuevaOrdenForm(); setSubScreen('nueva-orden'); }}
                onAbrirModalKit={() => setKitModalVisible(true)}
                onAbrirModalOrdenesKit={(kid) => { setKitOrdTargetId(kid); setKitOrdModalVisible(true); }}
                onCrearOrdenParaKit={(kid) => { resetNuevaOrdenForm(); setKitDestino(kid); setSubScreen('nueva-orden'); }}
                onEliminarPedidoActivo={() => {
                  setClientes(prev => prev.map(c => c.id === clienteActivoId ? { ...c, pedidos: c.pedidos.filter(p => p.id !== pedidoActivo.id) } : c));
                  setSubScreen('pedidos');
                }}
                onConfirmarPedido={() => {
                  setClientes(prev => prev.map(c => c.id === clienteActivoId ? { ...c, pedidos: c.pedidos.map(p => p.id === pedidoActivo.id ? { ...p, confirmado: true, status: 'En Proceso' } : p) } : c));
                }}
                onGuardarFechaLimite={(fecha) => {
                  setClientes(prev => prev.map(c => c.id === clienteActivoId ? { ...c, pedidos: c.pedidos.map(p => p.id === pedidoActivo.id ? { ...p, fechaLimite: fecha } : p) } : c));
                }}
                onHandleAdjuntosPedido={() => {}}
                onQuitarAdjunto={() => {}}
                onEliminarOrden={(oid) => {
                  setClientes(prev => prev.map(c => c.id === clienteActivoId ? { ...c, pedidos: c.pedidos.map(p => p.id === pedidoActivo.id ? { ...p, ordenes: p.ordenes.filter(o => o.id !== oid) } : p) } : c));
                }}
                onEliminarKit={(kid) => {
                  setClientes(prev => prev.map(c => c.id === clienteActivoId ? { ...c, pedidos: c.pedidos.map(p => p.id === pedidoActivo.id ? { ...p, kits: p.kits.filter(k => k.id !== kid) } : p) } : c));
                }}
                onReutilizarOrden={() => {}}
                onQuitarOrdenDeKit={() => {}}
              />
            )}

            {screen === 'nueva-orden' && (
              <NuevaOrdenScreen
                pedidoActivo={pedidoActivo}
                clienteActivo={clienteActivo}
                substepActual={substepActual}
                onGoSubstep={(step) => { setSubstepActual(step); if (step > maxSubstep) setMaxSubstep(step); }}
                tipoDiseno={tipoDiseno} setTipoDiseno={setTipoDiseno}
                disciplina={disciplina} setDisciplina={setDisciplina}
                categoria={categoria} setCategoria={setCategoria}
                tipoSolicitud={tipoSolicitud} setTipoSolicitud={setTipoSolicitud}
                observaciones={observaciones} setObservaciones={setObservaciones}
                prendasSeleccionadas={prendasSeleccionadas} setPrendasSeleccionadas={setPrendasSeleccionadas}
                clothesData={clothesData} setClothesData={setClothesData}
                adjuntosData={adjuntosData} setAdjuntosData={setAdjuntosData}
                areasActivas={areasActivas} setAreasActivas={setAreasActivas}
                areasSecuencia={areasSecuencia} setAreasSecuencia={setAreasSecuencia}
                onTogglePrenda={(nombre) => setPrendasSeleccionadas(prev => prev.includes(nombre) ? prev.filter(p => p !== nombre) : [...prev, nombre])}
                onToggleArea={(idx) => setAreasActivas(prev => prev.map((a, i) => i === idx ? { ...a, activa: !a.activa } : a))}
                onAbrirModalActividades={(idx) => { setActModalAreaIdx(idx); setActModalVisible(true); }}
                onQuitarActividad={() => {}}
                onSelectTagOp={() => {}}
                onToggleMulti={() => {}}
                onTextChange={() => {}}
                onQuitarAdjunto={() => {}}
                onHandleAdjuntosOrder={() => {}}
                onConfirmarOrden={() => {
                  const newOrdId = `ORD-${String(Date.now()).slice(-4)}`;
                  const newOrd = {
                    id: newOrdId,
                    code: `ORD-${Date.now()}`,
                    status: 'Nuevo',
                    clothes: clothesData,
                    config: { areas: areasActivas }
                  };
                  setClientes(prev => prev.map(c => c.id === clienteActivoId ? { ...c, pedidos: c.pedidos.map(p => p.id === pedidoActivo.id ? { ...p, ordenes: [newOrd, ...p.ordenes] } : p) } : c));
                  setSubScreen('detalle-pedido');
                }}
                onGoTo={handleGoTo}
                onShowAlert={(title, body, icon) => setConfirmData({ title, body, icon, hideCancelBtn: true })}
              />
            )}
          </>
        )}

        <ConfirmModal data={confirmData} onClose={() => setConfirmData(null)} />
        <KitModal
          visible={kitModalVisible}
          onClose={() => setKitModalVisible(false)}
          onConfirm={(nombre) => {
            const newKit = { id: `KIT-${Date.now()}`, nombre, fecha: new Date().toLocaleDateString('es-MX'), ordenIds: [] };
            setClientes(prev => prev.map(c => c.id === clienteActivoId ? { ...c, pedidos: c.pedidos.map(p => p.id === pedidoActivo.id ? { ...p, kits: [...p.kits, newKit] } : p) } : c));
            setKitModalVisible(false);
          }}
        />
        <KitOrdenesModal
          visible={kitOrdModalVisible}
          kitId={kitOrdTargetId}
          pedidoActivo={pedidoActivo}
          onClose={() => setKitOrdModalVisible(false)}
          onConfirmar={(kid, oids) => {
            setClientes(prev => prev.map(c => c.id === clienteActivoId ? { ...c, pedidos: c.pedidos.map(p => p.id === pedidoActivo.id ? { ...p, kits: p.kits.map(k => k.id === kid ? { ...k, ordenIds: [...k.ordenIds, ...oids] } : k) } : p) } : c));
            setKitOrdModalVisible(false);
          }}
        />
        <ActividadesModal
          visible={actModalVisible}
          areaIdx={actModalAreaIdx}
          areasActivas={areasActivas}
          onClose={() => setActModalVisible(false)}
          onConfirmar={() => setActModalVisible(false)}
        />
        <OrdenDetalleModal
          visible={ordenDetalleVisible}
          ordenId={ordenDetalleId}
          pedidoActivo={pedidoActivo}
          onClose={() => setOrdenDetalleVisible(false)}
          onGuardarPrendasOrden={() => {}}
        />
        <LogoutModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={() => {
            window.history.replaceState(null, '', '/');
            onLogout?.();
          }}
        />
      </main>
    </div>
  );
}
