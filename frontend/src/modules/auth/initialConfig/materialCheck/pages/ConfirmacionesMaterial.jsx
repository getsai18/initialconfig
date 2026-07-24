import { useState, useEffect } from 'react'
import { Search, Calendar, User, ArrowRight, ClipboardCheck, CheckCircle2, RefreshCw, FileText } from 'lucide-react'
import { Pagination } from '@/kernel/components/Pagination'
import ConfirmacionesService from '../services/ConfirmacionesService'

export function ConfirmacionesMaterial() {
  const [entregas, setEntregas] = useState([])
  const [finalizaciones, setFinalizaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterTipo, setFilterTipo] = useState('todos')
  const [filterArea, setFilterArea] = useState('todas')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10

  const fetchData = () => {
    setLoading(true)
    ConfirmacionesService.getAll()
      .then(res => {
        if (res?.entregas) setEntregas(res.entregas)
        if (res?.finalizaciones) setFinalizaciones(res.finalizaciones)
      })
      .catch(console.warn)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
  }, [])

  const items = [
    ...entregas.map(e => ({
      id: e.id,
      tipo: 'entrega',
      ordenId: e.ordenId,
      pedidoId: e.pedidoId,
      equipo: e.equipo,
      areaOrigen: e.areaOrigen,
      areaDestino: e.areaDestino,
      responsable: e.solicitante,
      validador: e.validador,
      fecha: e.fecha,
      timestamp: e.timestamp || Date.now(),
      observaciones: '',
    })),
    ...finalizaciones.map(f => ({
      id: f.id,
      tipo: 'finalizacion',
      ordenId: f.ordenId,
      pedidoId: f.pedidoId,
      equipo: f.equipo,
      areaOrigen: f.area,
      areaDestino: 'Fin de Producción',
      responsable: f.responsable,
      validador: '—',
      fecha: f.fecha,
      timestamp: f.timestamp || Date.now(),
      observaciones: f.observaciones || '',
    })),
  ]

  items.sort((a, b) => b.timestamp - a.timestamp)

  const filtered = items.filter(item => {
    const matchSearch = 
      item.pedidoId?.toLowerCase().includes(search.toLowerCase()) ||
      item.ordenId?.toLowerCase().includes(search.toLowerCase()) ||
      item.equipo?.toLowerCase().includes(search.toLowerCase()) ||
      item.responsable?.toLowerCase().includes(search.toLowerCase()) ||
      item.validador?.toLowerCase().includes(search.toLowerCase()) ||
      item.areaOrigen?.toLowerCase().includes(search.toLowerCase()) ||
      item.areaDestino?.toLowerCase().includes(search.toLowerCase())

    const matchTipo = filterTipo === 'todos' || item.tipo === filterTipo
    const matchArea = filterArea === 'todas' || item.areaOrigen === filterArea

    return matchSearch && matchTipo && matchArea
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => { setPage(1) }, [search, filterTipo, filterArea])

  const areas = ['todas', ...new Set(items.map(item => item.areaOrigen).filter(Boolean))]

  const countEntregas = items.filter(i => i.tipo === 'entrega').length
  const countFinalizaciones = items.filter(i => i.tipo === 'finalizacion').length

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-bold text-2xl text-foreground">Confirmaciones de Material</h1>
          <p className="text-muted-foreground text-sm mt-1">Historial cronológico de entregas entre áreas y finalizaciones de producción</p>
        </div>
        <button 
          onClick={fetchData} 
          className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex items-center gap-2 text-sm"
          title="Sincronizar historial"
        >
          <RefreshCw className="w-4 h-4" /> Sincronizar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-5 bg-card border border-border rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Total Confirmaciones</div>
            <div className="text-2xl font-bold mt-0.5">{items.length}</div>
          </div>
        </div>

        <div className="p-5 bg-card border border-border rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 shrink-0">
            <ArrowRight className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Entregas de Material</div>
            <div className="text-2xl font-bold mt-0.5">{countEntregas}</div>
          </div>
        </div>

        <div className="p-5 bg-card border border-border rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Finalizaciones de Lote</div>
            <div className="text-2xl font-bold mt-0.5">{countFinalizaciones}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por Pedido, Orden, Equipo, Solicitante..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Tipo:</span>
          <select
            value={filterTipo}
            onChange={e => setFilterTipo(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none"
          >
            <option value="todos">Todos</option>
            <option value="entrega">Entrega de Material</option>
            <option value="finalizacion">Fin de Producción</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Área Origen:</span>
          <select
            value={filterArea}
            onChange={e => setFilterArea(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none"
          >
            {areas.map(a => (
              <option key={a} value={a}>
                {a === 'todas' ? 'Todas' : a}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="border border-border rounded-xl overflow-x-auto bg-card shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-muted-foreground font-semibold">Fecha</th>
              <th className="px-4 py-3 text-muted-foreground font-semibold">Tipo</th>
              <th className="px-4 py-3 text-muted-foreground font-semibold">Pedido / Equipo</th>
              <th className="px-4 py-3 text-muted-foreground font-semibold">Orden</th>
              <th className="px-4 py-3 text-muted-foreground font-semibold">Ruta (Origen ➔ Destino)</th>
              <th className="px-4 py-3 text-muted-foreground font-semibold">Responsable</th>
              <th className="px-4 py-3 text-muted-foreground font-semibold">Validador</th>
              <th className="px-4 py-3 text-muted-foreground font-semibold">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                  Cargando historial de confirmaciones...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                  No se encontraron confirmaciones registradas
                </td>
              </tr>
            ) : (
              paginated.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3.5 whitespace-nowrap text-muted-foreground font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.fecha}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      item.tipo === 'entrega' 
                        ? 'bg-blue-100 text-blue-800 border border-blue-200/50' 
                        : 'bg-green-100 text-green-800 border border-green-200/50'
                    }`}>
                      {item.tipo === 'entrega' ? 'Entrega de Material' : 'Fin de Producción'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div>
                      <div className="font-bold text-foreground">{item.equipo}</div>
                      <div className="text-xs text-muted-foreground font-mono">{item.pedidoId}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground font-mono text-xs">
                    {item.ordenId}
                  </td>
                  <td className="px-4 py-3.5 font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-100 rounded text-xs">
                        {item.areaOrigen}
                      </span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        item.tipo === 'entrega' ? 'bg-gray-100 dark:bg-gray-100' : 'bg-green-50 text-green-700 dark:bg-green-950/30'
                      }`}>
                        {item.areaDestino}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{item.responsable}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">
                    {item.tipo === 'entrega' ? (
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{item.validador}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground max-w-xs truncate" title={item.observaciones}>
                    {item.observaciones ? (
                      <div className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span>{item.observaciones}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground/30">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPage={setPage}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
      />
    </div>
  )
}
