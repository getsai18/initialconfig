import { StatCard } from '@/kernel/components/StatCard'
import { OrdersTable } from '@/kernel/components/OrdersTable'
import { Clock, CheckCircle, PackageCheck, AlertTriangle } from 'lucide-react'
import { useDashboard } from '../hooks/useDashboard'

export function DashboardPage() {
  const { stats, orders } = useDashboard()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-bold">Inicio</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="En Progreso" value={stats.enProgreso} icon={Clock} color="blue" />
        <StatCard title="En Producción" value={stats.enProduccion} icon={CheckCircle} color="yellow" />
        <StatCard title="Terminadas" value={stats.terminadas} icon={PackageCheck} color="purple" />
        {/* Fijo en 0 hasta que exista el módulo de Incidencias en el backend. */}
        <StatCard title="Incidencias" value={stats.incidencias} icon={AlertTriangle} color="red" />
      </div>
      <OrdersTable orders={orders} />
    </div>
  )
}
