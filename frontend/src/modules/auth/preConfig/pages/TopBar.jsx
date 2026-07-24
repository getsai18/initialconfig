export default function Topbar({ screen, clienteActivo, pedidoActivo, onGoTo }) {
  function Breadcrumb() {
    const cl = clienteActivo;

    if (screen === 'clientes') {
      return <span className="font-semibold text-foreground">Clientes</span>;
    }
    if (screen === 'pedidos') {
      return (
        <>
          <span className="cursor-pointer hover:underline text-muted-foreground" onClick={() => onGoTo('clientes')}>Clientes</span>
          <span className="mx-1 text-muted-foreground">›</span>
          <span className="font-semibold text-foreground">{cl?.nombre || ''}</span>
        </>
      );
    }
    if (screen === 'detalle-pedido') {
      return (
        <>
          <span className="cursor-pointer hover:underline text-muted-foreground" onClick={() => onGoTo('clientes')}>Clientes</span>
          <span className="mx-1 text-muted-foreground">›</span>
          <span className="cursor-pointer hover:underline text-muted-foreground" onClick={() => onGoTo('pedidos')}>{cl?.nombre || ''}</span>
          <span className="mx-1 text-muted-foreground">›</span>
          <span className="font-semibold text-foreground">Pedido</span>
        </>
      );
    }
    if (screen === 'reutilizar') {
      return (
        <>
          <span className="cursor-pointer hover:underline text-muted-foreground" onClick={() => onGoTo('clientes')}>Clientes</span>
          <span className="mx-1 text-muted-foreground">›</span>
          <span className="cursor-pointer hover:underline text-muted-foreground" onClick={() => onGoTo('pedidos')}>{cl?.nombre || ''}</span>
          <span className="mx-1 text-muted-foreground">›</span>
          <span className="font-semibold text-foreground">Reutilizar</span>
        </>
      );
    }
    if (screen === 'nueva-orden') {
      return (
        <>
          <span className="cursor-pointer hover:underline text-muted-foreground" onClick={() => onGoTo('clientes')}>Clientes</span>
          <span className="mx-1 text-muted-foreground">›</span>
          <span className="cursor-pointer hover:underline text-muted-foreground truncate" onClick={() => onGoTo('pedidos')}>{cl?.nombre || ''}</span>
          <span className="mx-1 text-muted-foreground">›</span>
          <span className="cursor-pointer hover:underline text-muted-foreground" onClick={() => onGoTo('detalle-pedido')}>Pedido</span>
          <span className="mx-1 text-muted-foreground">›</span>
          <span className="font-semibold text-foreground">Nueva orden</span>
        </>
      );
    }
    return <span className="font-semibold text-foreground capitalize">{screen}</span>;
  }

  return (
    <div className="flex items-center gap-4 px-6 h-14 bg-card border-b border-border sticky top-0 z-20">
      <div className="font-bold text-sm tracking-tight text-foreground flex items-center gap-2">
        CPManager
      </div>
      <div className="w-px h-5 bg-border"></div>
      <div className="breadcrumb flex items-center gap-1.5 text-sm overflow-x-auto">
        <Breadcrumb />
      </div>
    </div>
  );
}
