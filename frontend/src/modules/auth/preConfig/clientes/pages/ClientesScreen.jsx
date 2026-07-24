import { useState } from 'react';
import { Search, Eye, Plus, UserPlus } from 'lucide-react';
import ClienteModal from '../components/ClienteModal';

export default function ClientesScreen({ clientes = [], onVerPedidos, onCrearPedidoDesdeCliente, onCrearCliente }) {
  const [filtro, setFiltro] = useState('');
  const [clienteModalVisible, setClienteModalVisible] = useState(false);

  const filtrados = clientes.filter(c =>
    c.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
    (c.vendor || '').toLowerCase().includes(filtro.toLowerCase()) ||
    (c.informacion || '').toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Equipos</h1>
          <p className="text-sm text-muted-foreground mt-1">Selecciona un equipo para ver sus pedidos</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar equipo o representante…"
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm bg-input-background border border-border rounded-lg outline-none focus:ring-2 focus:ring-ring w-64"
            />
          </div>

          <button
            onClick={() => setClienteModalVisible(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" /> Nuevo equipo
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-x-auto shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Equipo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Representante</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Información</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Último pedido</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pedidos</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="text-center py-16 text-muted-foreground">
                    <div className="text-4xl mb-3">🔍</div>
                    <div className="text-sm">No se encontraron equipos</div>
                  </div>
                </td>
              </tr>
            ) : filtrados.map(c => (
              <tr key={c.id} className="border-b border-border last:border-0 hover:bg-accent/40 transition-colors">
                <td className="px-4 py-3 font-semibold text-foreground text-sm">{c.nombre}</td>
                <td className="px-4 py-3 text-muted-foreground text-sm">
                  {c.vendor || <span className="italic">Sin representante</span>}
                </td>
                <td className="px-4 py-3 text-muted-foreground text-sm max-w-xs">
                  {c.informacion
                    ? <span className="truncate block">{c.informacion}</span>
                    : <span className="italic">—</span>}
                </td>
                <td className="px-4 py-3 text-muted-foreground text-sm">{c.ultimoPedido || 'Sin pedidos'}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700">
                    {c.totalPedidos ?? 0} pedido{(c.totalPedidos ?? 0) !== 1 ? 's' : ''}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onVerPedidos(c.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-accent transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> Ver pedidos
                    </button>
                    <button
                      onClick={() => onCrearPedidoDesdeCliente(c.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> <span className="hidden md:block">Pedido</span> 
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ClienteModal
        visible={clienteModalVisible}
        clientes={clientes}
        onClose={() => setClienteModalVisible(false)}
        onConfirm={(data) => { onCrearCliente(data); setClienteModalVisible(false); }}
      />
    </div>
  );
}
