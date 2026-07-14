import { useState, useEffect } from 'react';
import AdjuntoItem from './AdjuntoItem';
import { ChevronLeft, Trash2, Layers, Plus, Eye, ChevronRight, Upload, Lock, CheckCircle, ClipboardList, AlertCircle, Ban, Copy, MinusCircle } from 'lucide-react';

import { displayStatus, statusBadgeCls, pedidoVencido } from '../utils/helpers';


// Legacy data may still carry status "Cancelado" from when the cancel feature existed;
// it is shown read-only (no action can produce or clear it anymore).
function OrdenRow({ o, onVerDetalle, esBorrador, onPedirAccion, puedoAgregar, onReutilizar }) {
  const isCanceled = o.status === 'Cancelado';
  const totalPiezas = (o.clothes || []).reduce((s, c) => s + (c.conf.tot || 0), 0);
  const stCls = isCanceled ? 'bg-gray-200 text-gray-500' : statusBadgeCls(o.status);

  return (
    <div
      className={`orden-row flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-3 rounded-lg mb-2 border border-transparent ${isCanceled ? 'bg-gray-50/50' : 'cursor-pointer hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors'}`}
      onClick={() => !isCanceled && onVerDetalle(o.id)}
      title={isCanceled ? "Orden cancelada" : "Ver detalle de la orden"}
    >
      {/* Sección de Info */}
      <div className={`flex w-full sm:w-auto items-start sm:items-center ${isCanceled ? 'opacity-60' : ''}`}>
        <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-md whitespace-nowrap mr-3 mt-0.5 sm:mt-0 ${isCanceled ? 'bg-gray-200 text-gray-500' : 'text-indigo-600 bg-indigo-50'}`}>ORDEN</span>
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-semibold ${isCanceled ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{o.id}</div>
          <div className="text-xs text-gray-400 mt-0.5">{totalPiezas} piezas · {(o.clothes || []).length} tipo{(o.clothes || []).length !== 1 ? 's' : ''} de prenda</div>
        </div>
      </div>
      {/* Sección de Botones / Estado */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
        {o.status && <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${stCls}`}>{isCanceled ? 'CANCELADO' : displayStatus(o.status)}</span>}

        <div className="flex items-center gap-2">
          {puedoAgregar && !isCanceled && (
            <button
              onClick={(e) => { e.stopPropagation(); onReutilizar(o.id); }}
              className="px-2 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 bg-white rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-1.5"
              title="Crear una nueva orden copiando esta información"
            >
              <Copy className="w-4 h-4" /> <span className="hidden sm:inline">Reutilizar</span>
            </button>
          )}

          {esBorrador && !isCanceled && (
            <button
              onClick={(e) => { e.stopPropagation(); onPedirAccion('eliminar', 'orden', o.id); }}
              className="px-2 py-1.5 text-xs font-medium text-red-500 border border-red-200 bg-white rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Eliminar</span>
            </button>
          )}

          {!isCanceled && <ChevronRight className="w-4 h-4 text-gray-300 hidden sm:block flex-shrink-0" />}
        </div>
      </div>
    </div>
  );
}
function OrdenRowKit({ o, kitId, onVerDetalle, esBorrador, onPedirAccion, kitCancelado, puedoAgregar, onReutilizar, onQuitarDelKit }) {
  const isCanceled = kitCancelado || o.status === 'Cancelado';
  const hideButtons = kitCancelado;
  const totalPiezas = (o.clothes || []).reduce((s, c) => s + (c.conf.tot || 0), 0);
  const stCls = isCanceled ? 'bg-gray-200 text-gray-500' : statusBadgeCls(o.status);

  return (
    <div
      className={`orden-row flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-3 rounded-lg mb-2 ${isCanceled ? 'bg-gray-100/50' : 'bg-gray-50 cursor-pointer hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors'}`}
      onClick={() => !isCanceled && onVerDetalle(o.id)}
    >
      <div className={`flex w-full sm:w-auto items-start sm:items-center ${isCanceled ? 'opacity-60' : ''}`}>
        <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-md whitespace-nowrap mr-3 mt-0.5 sm:mt-0 ${isCanceled ? 'bg-gray-200 text-gray-500' : 'text-indigo-600 bg-indigo-50'}`}>ORDEN</span>
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-semibold ${isCanceled ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{o.id}</div>
          <div className="text-xs text-gray-400 mt-0.5">{totalPiezas} piezas · {(o.clothes || []).length} tipo{(o.clothes || []).length !== 1 ? 's' : ''} de prenda</div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-200">
        {o.status && <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${stCls}`}>{isCanceled ? 'CANCELADO' : displayStatus(o.status)}</span>}

        <div className="flex items-center gap-2">
          {!hideButtons && puedoAgregar && !isCanceled && (
            <button
              onClick={e => { e.stopPropagation(); onReutilizar(o.id, kitId); }}
              className="px-2 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 bg-white rounded-lg hover:bg-indigo-50 transition-colors flex gap-1.5"
              title="Crear una nueva orden copiando esta información dentro de este kit"
            >
              <Copy className="w-4 h-4" /> <span className="hidden sm:inline">Reutilizar</span>
            </button>
          )}

          {!hideButtons && esBorrador && !isCanceled && (
            <button
              onClick={e => { e.stopPropagation(); onQuitarDelKit(o.id, kitId); }}
              className="px-2 py-1.5 text-xs font-medium text-amber-600 border border-amber-200 bg-white rounded-lg hover:bg-amber-50 transition-colors flex gap-1.5"
              title="Quitar esta orden del kit (la orden sigue existiendo en el pedido)"
            >
              <MinusCircle className="w-4 h-4" /> <span className="hidden sm:inline">Quitar del kit</span>
            </button>
          )}

          {!hideButtons && esBorrador && !isCanceled && (
            <button
              onClick={e => { e.stopPropagation(); onPedirAccion('eliminar', 'orden', o.id); }}
              className="px-2 py-1.5 text-xs font-medium text-red-500 border border-red-200 bg-white rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors flex gap-1.5"
            >
              <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Eliminar</span>
            </button>
          )}

          {!isCanceled && <ChevronRight className="w-4 h-4 text-gray-300 hidden sm:block flex-shrink-0" />}
        </div>
      </div>
    </div>
  );
}
function KitBlock({ k, pedidoActivo, puedoAgregar, onVerDetalle, onAbrirOrdenesKit, onCrearOrdenKit, onPedirAccion, onReutilizar, onQuitarDelKit }) {
  const isCanceled = k.status === 'Cancelado';
  const ordenesDelKit = k.ordenIds.map((oid) => pedidoActivo.ordenes.find((o) => o.id === oid)).filter(Boolean);

  return (
    <div className={`bg-white border ${isCanceled ? 'border-gray-200 bg-gray-50' : 'border-gray-200'} rounded-xl px-4 py-3 mb-2 transition-opacity`}>

      {/* Header del Kit adaptado a mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 pb-2 border-b sm:border-b-0 border-gray-100">
        <div className="flex items-center flex-wrap gap-2 flex-1">
          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${isCanceled ? 'bg-gray-200 text-gray-500' : 'bg-purple-100 text-purple-700'}`}>Kit</span>
          <span className={`text-sm font-semibold ${isCanceled ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{k.nombre}</span>
          {k.status && !isCanceled && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${statusBadgeCls(k.status)}`}>{displayStatus(k.status)}</span>
          )}
          <span className="text-xs text-gray-400 sm:ml-auto w-full sm:w-auto">{k.fecha} · {ordenesDelKit.length} orden{ordenesDelKit.length !== 1 ? 'es' : ''}</span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {!pedidoActivo.confirmado && !isCanceled && (
            <button onClick={() => onPedirAccion('eliminar', 'kit', k.id)} className="px-2 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 flex items-center">
              <Trash2 className="w-3.5 h-3.5 sm:mr-1" /> <span className="hidden sm:inline">Eliminar kit</span>
            </button>
          )}

          {puedoAgregar && !isCanceled ? (
            <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
              <button onClick={() => onAbrirOrdenesKit(k.id)} className="flex-1 sm:flex-none justify-center inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                <Layers className="w-3.5 h-3.5" />
                <span className="sm:hidden">Existente</span>
                <span className="hidden sm:inline">Agregar orden existente</span>
              </button>
              <button onClick={() => onCrearOrdenKit(k.id)} className="flex-1 sm:flex-none justify-center inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#050314] text-white rounded-lg hover:bg-gray-800">
                <Plus className="w-3.5 h-3.5" />
                <span className="sm:hidden">Nueva</span>
                <span className="hidden sm:inline">Nueva orden</span>
              </button>
            </div>
          ) : (
            !isCanceled && <span className="text-xs text-red-500 flex items-center gap-1 w-full sm:w-auto mt-1 sm:mt-0">🔒 Bloqueado</span>
          )}
        </div>
      </div>

      {/* Lista de órdenes dentro del kit */}
      <div className="kit-ordenes">
        {ordenesDelKit.length === 0
          ? <div className="text-xs text-gray-400 py-1">Sin órdenes asignadas</div>
          : ordenesDelKit.map((o) => (
            <OrdenRowKit
              key={o.id}
              o={o}
              kitId={k.id}
              onVerDetalle={onVerDetalle}
              esBorrador={!pedidoActivo.confirmado}
              onPedirAccion={onPedirAccion}
              kitCancelado={isCanceled}
              puedoAgregar={puedoAgregar}
              onReutilizar={onReutilizar}
              onQuitarDelKit={onQuitarDelKit}
            />
          ))
        }
      </div>
    </div>
  );
}
export default function DetallePedidoScreen({
  pedidoActivo, clienteActivo,
  onGoTo, onVerDetalleOrden,
  onIniciarNuevaOrden, onAbrirModalKit,
  onAbrirModalOrdenesKit, onCrearOrdenParaKit,
  onEliminarPedidoActivo, onConfirmarPedido,
  onGuardarFechaLimite,
  onHandleAdjuntosPedido, onQuitarAdjunto,
  onEliminarOrden,
  onEliminarKit,
  onReutilizarOrden,
  onQuitarOrdenDeKit,
}) {
  if (!pedidoActivo || !clienteActivo) return null;

  const p = pedidoActivo;
  const vencido = pedidoVencido(p);
  const esCerrado = false;

  const puedoAgregar = !vencido && !esCerrado;

  const [modalAccion, setModalAccion] = useState<{ isOpen, accion: 'eliminar' | null, tipo: 'kit' | 'orden' | null, id }>({ isOpen: false, accion: null, tipo: null, id: '' });

  function handlePedirAccion(accion, tipo, id) {
    setModalAccion({ isOpen: true, accion, tipo, id });
  }

  const estadoTexto = !p.confirmado ? "Borrador" : displayStatus(p.status);
  const stCls = !p.confirmado ? "bg-gray-100 text-gray-600" : statusBadgeCls(p.status);

  // Lógica de separación de listas Activas vs Canceladas
  const ordenesEnKit = new Set(p.kits.flatMap((k) => k.ordenIds));
  const ordenesSueltas = p.ordenes.filter((o) => !ordenesEnKit.has(o.id));

  const ordenesActivasSueltas = ordenesSueltas.filter((o) => o.status !== 'Cancelado');
  const ordenesCanceladasSueltas = ordenesSueltas.filter((o) => o.status === 'Cancelado');

  const kitsActivos = p.kits.filter((k) => k.status !== 'Cancelado');
  const kitsCancelados = p.kits.filter((k) => k.status === 'Cancelado');

  // ── Controlled date input ───────────────────────────────────
  const [dateValue, setDateValue] = useState(p.fechaLimite || '');
  const [dateTouched, setDateTouched] = useState(false);
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    setDateValue(p.fechaLimite || '');
    setDateError('');
  }, [p.id, p.fechaLimite]);

  const todayISO = new Date().toISOString().slice(0, 10);

  function handleDateChange(e) {
    const val = e.target.value;
    setDateValue(val);
    setDateTouched(true);
    if (val && val < todayISO) {
      setDateError('La fecha no puede ser anterior a hoy');
    } else {
      setDateError('');
    }
  }

  function handleDateBlur() {
    if (!dateValue) {
      setDateError('');
      return;
    }
    if (dateValue < todayISO) {
      setDateError('La fecha no puede ser anterior a hoy');
      return;
    }
    setDateError('');
    onGuardarFechaLimite(dateValue);
  }

  function handleDateSave() {
    if (!dateValue) {
      setDateError('Ingresa una fecha límite');
      return;
    }
    if (dateValue < todayISO) {
      setDateError('La fecha no puede ser anterior a hoy');
      return;
    }
    setDateError('');
    onGuardarFechaLimite(dateValue);
  }

  // ── Adjunto validation ───────────────────────────────────────
  const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'pdf', 'txt', 'doc', 'docx'];
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const MAX_FILES = 10;
  const [adjError, setAdjError] = useState('');

  function handleAdjuntosValidated(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setAdjError('');

    if ((p.adjuntos?.length || 0) + files.length > MAX_FILES) {
      setAdjError(`Máximo ${MAX_FILES} archivos por pedido.`);
      event.target.value = '';
      return;
    }
    for (const f of files) {
      const ext = f.name.split('.').pop()?.toLowerCase() || '';
      if (!ALLOWED_MIME.includes(f.type) && !ALLOWED_EXT.includes(ext)) {
        setAdjError(`Tipo no permitido: "${f.name}". Usa JPG, PNG, PDF, DOCX o TXT.`);
        event.target.value = '';
        return;
      }
      if (f.size > MAX_FILE_SIZE) {
        setAdjError(`"${f.name}" supera el límite de 10 MB.`);
        event.target.value = '';
        return;
      }
    }
    onHandleAdjuntosPedido(event);
  }

  let modalConfig = { title: '', body: '', confirmStr: '', btnColor: '' };
  if (modalAccion.accion === 'eliminar') {
    modalConfig = { title: `Eliminar ${modalAccion.tipo === 'kit' ? 'Kit' : 'Orden'}`, body: `¿Estás seguro de que deseas eliminar est${modalAccion.tipo === 'kit' ? 'e' : 'a'} ${modalAccion.tipo}? Si tiene información adentro también se quitará del pedido.`, confirmStr: 'Sí, eliminar', btnColor: 'bg-red-600 hover:bg-red-700' };
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{p.id}</h1>
          <p className="text-sm text-gray-500 mt-1">{p.fecha} · {clienteActivo.nombre}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => onGoTo('pedidos')} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Pedidos
          </button>
          {!p.confirmado && (
            <button onClick={onEliminarPedidoActivo} className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
              <Trash2 className="w-4 h-4" /> Eliminar
            </button>
          )}
          {puedoAgregar && (
            <button onClick={onAbrirModalKit} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Layers className="w-4 h-4" /> Agregar kit
            </button>
          )}
          {puedoAgregar && (
            <button onClick={onIniciarNuevaOrden} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#050314] text-white rounded-lg hover:bg-gray-800 transition-colors">
              <Plus className="w-4 h-4" /> Agregar orden
            </button>
          )}
        </div>
      </div>

      {vencido && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 mb-4">
          <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="text-xs leading-relaxed"><strong className="font-semibold block">Fecha límite vencida</strong>No se pueden agregar más órdenes ni kits a este pedido.</div>
        </div>
      )}

      {/* Info grid */}
      <div className="detalle-grid">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Pedido</div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-base font-bold text-gray-900">{p.id}</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${stCls}`}>{estadoTexto}</span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Fecha de creación</div>
          <div className="text-base font-semibold text-gray-900">{p.fecha}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Fecha límite</div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateValue}
              min={todayISO}
              onChange={handleDateChange}
              onBlur={handleDateBlur}
              className={`flex-1 text-sm px-3 py-1.5 bg-white border rounded-lg outline-none focus:ring-2 text-gray-900 transition-colors ${dateError ? 'border-red-400 focus:border-red-500' : 'border-gray-200'}`}
            />
            {dateValue && !dateError && dateValue >= todayISO && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-50 text-green-700">Vigente</span>}
            {vencido && !dateError && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-50 text-red-700">Vencida</span>}
          </div>
          {dateError && <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600"><AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{dateError}</div>}
          {dateTouched && !dateError && dateValue && <button onClick={handleDateSave} className="mt-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium">Guardar fecha</button>}
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Cliente / Órdenes</div>
          <div className="text-sm font-semibold text-gray-900">{clienteActivo.nombre}</div>
          <div className="text-xs text-gray-400 mt-0.5">{p.ordenes.length} orden{p.ordenes.length !== 1 ? 'es' : ''} · {p.kits.length} kit{p.kits.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        {!p.confirmado ? (
          <button onClick={onConfirmarPedido} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700">
            <CheckCircle className="w-4 h-4" /> Confirmar pedido
          </button>
        ) : (
          <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-green-50 text-green-700 rounded-lg border border-green-200">
            <CheckCircle className="w-4 h-4" /> Confirmado · {displayStatus(p.status)}
          </span>
        )}
      </div>

      {/* Adjuntos */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
          Archivos adjuntos
        </div>

        {adjError && (
          <div className="flex items-center gap-2 mb-3 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {adjError}
          </div>
        )}

        {/* Botón ocupa todo el ancho */}
        <div
          className="w-full border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 p-6 text-center cursor-pointer hover:border-gray-400 transition-colors mb-4"
          onClick={() => document.getElementById('dp-adj-input').click()}
        >
          <Upload className="w-7 h-7 text-gray-400 mx-auto mb-2" />
          <div className="text-sm font-medium text-gray-500">Agregar imágenes</div>
          <div className="text-xs text-gray-400 mt-1">
            JPG, PNG, PDF, DOCX, TXT · máx. 10MB · hasta {MAX_FILES} archivos
          </div>
        </div>

        <input
          type="file"
          id="dp-adj-input"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.gif,.svg,.pdf,.txt,.doc,.docx"
          className="hidden"
          onChange={handleAdjuntosValidated}
        />

        {/* Imágenes debajo */}
        {p.adjuntos.length === 0 ? (
          <div className="text-sm text-gray-400">Sin archivos adjuntos</div>
        ) : (
          <div className="adjunto-grid">
            {p.adjuntos.map((a, i) => (
              <AdjuntoItem
                key={a.id || i}
                adjunto={a}
                index={i}
                scope="pedido"
                onQuitar={onQuitarAdjunto}
              />
            ))}
          </div>
        )}
      </div>


      {/* Órdenes sueltas ACTIVAS */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">Órdenes</div>
          {puedoAgregar
            ? <button onClick={onIniciarNuevaOrden} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#050314] text-white rounded-lg hover:bg-gray-800"><Plus className="w-3.5 h-3.5" /> Nueva orden</button>
            : <span className="text-xs text-red-500 flex items-center gap-1">🔒 No se pueden agregar órdenes</span>
          }
        </div>
        {ordenesActivasSueltas.length === 0 ? (
          <div className="text-center py-8 text-gray-400"><ClipboardList className="w-8 h-8 mx-auto mb-2 text-gray-300" /><div className="text-sm">Sin órdenes activas</div></div>
        ) : ordenesActivasSueltas.map((o) => (
          <OrdenRow key={o.id} o={o} onVerDetalle={onVerDetalleOrden} esBorrador={!p.confirmado} onPedirAccion={handlePedirAccion} puedoAgregar={puedoAgregar} onReutilizar={onReutilizarOrden} />
        ))}
      </div>

      {/* Kits ACTIVOS */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">Kits</div>
          {puedoAgregar
            ? <button onClick={onAbrirModalKit} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50"><Layers className="w-3.5 h-3.5" /> Nuevo kit</button>
            : <span className="text-xs text-red-500 flex items-center gap-1">🔒 No se pueden agregar kits</span>
          }
        </div>
        {kitsActivos.length === 0 ? (
          <div className="text-center py-8 text-gray-400"><Layers className="w-8 h-8 mx-auto mb-2 text-gray-300" /><div className="text-sm">Sin kits activos</div></div>
        ) : kitsActivos.map((k) => (
          <KitBlock
            key={k.id}
            k={k}
            pedidoActivo={p}
            puedoAgregar={puedoAgregar}
            onVerDetalle={onVerDetalleOrden}
            onAbrirOrdenesKit={onAbrirModalOrdenesKit}
            onCrearOrdenKit={onCrearOrdenParaKit}
            onPedirAccion={handlePedirAccion}
            onReutilizar={onReutilizarOrden}
            onQuitarDelKit={onQuitarOrdenDeKit}
          />
        ))}
      </div>

      {/* SECCIÓN: HISTORIAL DE CANCELADOS (Al fondo) */}
      {(ordenesCanceladasSueltas.length > 0 || kitsCancelados.length > 0) && (
        <div className="mt-8 pt-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Ban className="w-4 h-4" /> Historial de Cancelados
          </h2>

          {ordenesCanceladasSueltas.length > 0 && (
            <div className="bg-gray-100 border border-gray-200 rounded-xl p-5 mb-4 opacity-80">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-4 pb-3 border-b border-gray-200">Órdenes Sueltas Canceladas</div>
              {ordenesCanceladasSueltas.map((o) => (
                <OrdenRow key={o.id} o={o} onVerDetalle={onVerDetalleOrden} esBorrador={!p.confirmado} onPedirAccion={handlePedirAccion} />
              ))}
            </div>
          )}

          {kitsCancelados.map((k) => (
            <div className="opacity-80" key={k.id}>
              <KitBlock
                k={k}
                pedidoActivo={p}
                puedoAgregar={false}
                onVerDetalle={onVerDetalleOrden}
                onAbrirOrdenesKit={onAbrirModalOrdenesKit}
                onCrearOrdenKit={onCrearOrdenParaKit}
                onPedirAccion={handlePedirAccion}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal Dinámico (Eliminar / Cancelar / Restaurar) */}
      {modalAccion.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 border border-gray-100">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-red-500">
              <AlertCircle className="w-5 h-5" />
              {modalConfig.title}
            </h3>
            <p className="text-sm text-gray-600 mb-5">{modalConfig.body}</p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setModalAccion({ ...modalAccion, isOpen: false })}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  if (modalAccion.accion === 'eliminar') {
                    if (modalAccion.tipo === 'kit') onEliminarKit(modalAccion.id);
                    if (modalAccion.tipo === 'orden' && onEliminarOrden) onEliminarOrden(modalAccion.id);
                  }
                  setModalAccion({ ...modalAccion, isOpen: false });
                }}
                className={`px-4 py-2 timport { ChevronLeft, Trash2, Layers, Plus, Eye, ChevronRight, Upload, Lock, CheckCircle, ClipboardList, AlertCircle } from 'lucide-react';ext-sm font-medium text-white rounded-lg ${modalConfig.btnColor}`}
              >
                {modalConfig.confirmStr}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}