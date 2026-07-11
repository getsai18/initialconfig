import { StatCard } from '@/kernel/components/StatCard'
import { OrdersTable } from '@/kernel/components/OrdersTable'
import { Clock, CheckCircle, PauseCircle, AlertTriangle } from 'lucide-react'
import { useDashboard } from '../hooks/useDashboard'

export function DashboardPage() {
  const { stats, orders } = useDashboard()

  const getCurrentMonth = () => {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    return months[new Date().getMonth()]
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-bold">Inicio</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Pendientes" value={stats.pendientes} icon={Clock} color="yellow" />
        <StatCard title="En Progreso" value={stats.enProgreso} icon={CheckCircle} color="blue" />
        <StatCard title="En Espera" value={stats.enEspera} icon={PauseCircle} color="purple" />
        <StatCard title="Incidencias" value={stats.incidencias} icon={AlertTriangle} color="red" subtitle={getCurrentMonth()} />
      </div>
      <OrdersTable orders={orders} />
    </div>
  )
}
