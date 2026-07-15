import { RotateCcw } from 'lucide-react';

export default function Topbar({ screen, clienteActivo, pedidoActivo, onGoTo, onRestablecerDatos }) {
  function Breadcrumb() {
    const cl = clienteActivo;
    const ped = pedidoActivo;

    if (screen === 'clientes') {
      return <span className="bc-current">Clientes</span>;
    }
    if (screen === 'pedidos') {
      return (
        <>
          <span className="bc-item" onClick={() => onGoTo('clientes')}>Clientes</span>
          <span className="bc-sep mx-1">›</span>
          <span className="bc-current">{cl?.nombre || ''}</span>
        </>
      );
    }
    if (screen === 'detalle-pedido') {
      return (
        <>
          <span className="bc-item" onClick={() => onGoTo('clientes')}>Clientes</span>
          <span className="bc-sep mx-1">›</span>
          <span className="bc-item" onClick={() => onGoTo('pedidos')}>{cl?.nombre || ''}</span>
          <span className="bc-sep mx-1">›</span>
          <span className="bc-current">Pedido</span>
        </>
      );
    }
    if (screen === 'reutilizar') {
      return (
        <>
          <span className="bc-item" onClick={() => onGoTo('clientes')}>Clientes</span>
          <span className="bc-sep mx-1">›</span>
          <span className="bc-item" onClick={() => onGoTo('pedidos')}>{cl?.nombre || ''}</span>
          <span className="bc-sep mx-1">›</span>
          <span className="bc-current">Reutilizar</span>
        </>
      );
    }
    if (screen === 'nueva-orden') {
      return (
        <>
          <span className="bc-item" onClick={() => onGoTo('clientes')}>Clientes</span>
          <span className="bc-sep mx-1">›</span>
          <span className="bc-item  truncate block" onClick={() => onGoTo('pedidos')}>{cl?.nombre || ''}</span>
          <span className="bc-sep mx-1">›</span>
          <span className="bc-item" onClick={() => onGoTo('detalle-pedido')}>Pedido</span>
          <span className="bc-sep mx-1">›</span>
          <span className="bc-current">Nueva orden</span>
        </>
      );
    }
    return <span className="bc-current">{screen}</span>;
  }

  return (
    <div className="flex items-center gap-4 px-6 h-14 bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="font-bold text-sm tracking-tight text-gray-900 flex items-center gap-2">
        CPManager
      </div>
      <div className="w-px h-5 bg-gray-200"></div>
      <div className="breadcrumb flex items-center gap-1.5 text-sm overflow-x-auto">
        <Breadcrumb />
      </div>
    </div>
  );
}
