import { useState } from 'react';
import { Search, Eye, Plus, UserPlus } from 'lucide-react';
import ClienteModal from '../components/ClienteModal';

export default function ClientesScreen({ clientes, onVerPedidos, onCrearPedidoDesdeCliente, onCrearCliente }) {
  const [filtro, setFiltro] = useState('');
  const [clienteModalVisible, setClienteModalVisible] = useState(false);

  const filtrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    (c.vendor || '').toLowerCase().includes(filtro.toLowerCase()) ||
    (c.informacion || '').toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div style={{overflow: 'auto'}}>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Equipos</h1>
          <p className="text-sm text-gray-500 mt-1">Selecciona un equipo para ver sus pedidos</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar equipo o representante…"
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-400 w-64"
            />
          </div>

           <button
            onClick={() => setClienteModalVisible(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#050314] text-primary-foreground  rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" /> Nuevo equipo
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Equipo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Representante</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Información</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Último pedido</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Pedidos</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="text-center py-16 text-gray-400">
                     <div className="text-4xl mb-3">🔍</div>
                     <div className="text-sm">No se encontraron equipos</div>
                  </div>
                </td>
              </tr>
            ) : filtrados.map(c => (
              <tr key={c.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{c.nombre}</td>
                <td className="px-4 py-3 text-gray-600 text-sm">
                  {c.vendor || <span className="text-gray-400 italic">Sin representante</span>}
                </td>
                <td className="px-4 py-3 text-gray-500 text-sm max-w-xs">
                  {c.informacion
                    ? <span className="truncate block">{c.informacion}</span>
                    : <span className="text-gray-400 italic">—</span>}
                </td>
                <td className="px-4 py-3 text-gray-500 text-sm">{c.ultimoPedido || 'Sin pedidos'}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700">
                    {c.totalPedidos ?? 0} pedido{(c.totalPedidos ?? 0) !== 1 ? 's' : ''}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onVerPedidos(c.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> Ver pedidos
                    </button>
                    <button
                      onClick={() => onCrearPedidoDesdeCliente(c.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#050314] text-white rounded-lg hover:bg-gray-800 transition-colors"
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
