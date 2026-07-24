import { ChevronLeft, Plus, Eye } from 'lucide-react';
import { displayStatus, statusBadgeCls } from '../../utils/helpers';

export default function PedidosScreen({
  clienteActivo,
  onGoTo,
  onCrearPedidoNuevo,
  onVerDetallePedido,
}) {
  if (!clienteActivo) return null;
  const pedidos = clienteActivo.pedidos || [];

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{clienteActivo.nombre}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {clienteActivo.totalPedidos || pedidos.length} pedido{(clienteActivo.totalPedidos || pedidos.length) !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onGoTo('clientes')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-accent transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Clientes
          </button>
          <button
            onClick={onCrearPedidoNuevo}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
          >
            <Plus className="w-4 h-4" /> Nuevo pedido
          </button>
        </div>
      </div>

      {pedidos.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <div className="text-4xl mb-3">📦</div>
          <div className="text-sm">No hay pedidos registrados</div>
        </div>
      ) : (
        pedidos.map((p) => {
          const totalOrd = (p.ordenes || []).length;
          const totalKits = (p.kits || []).length;
          const stCls = statusBadgeCls(p.status);
          return (
            <div key={p.id} className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-2.5 hover:border-accent transition-colors">
              <div className="flex items-center justify-between sm:w-auto">
                <div className="font-mono text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-lg whitespace-nowrap">{p.id}</div>
                <span className={`sm:hidden inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${stCls}`}>
                  {displayStatus(p.status)}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="text-sm font-semibold text-foreground">{p.fecha}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {totalOrd} orden{totalOrd !== 1 ? 'es' : ''}
                  {totalKits > 0 ? ` · ${totalKits} kit${totalKits !== 1 ? 's' : ''}` : ''}
                </div>
              </div>
              
              <span className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${stCls}`}>
                {displayStatus(p.status)}
              </span>
              
              <div className="flex gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                <button
                  onClick={() => onVerDetallePedido(p.id)}
                  className="flex-1 sm:flex-none justify-center inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" /> Ver detalle
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
