import { useState, useEffect } from 'react';
import { X, Search, CheckCircle } from 'lucide-react';
import ApiGateway from '@/kernel/api/ApiGateway';

export default function ActividadesModal({ visible, areaIdx, areasActivas, onClose, onConfirmar }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [catalogoActividades, setCatalogoActividades] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);

  useEffect(() => {
    if (visible) {
      setSearchQuery('');
      setSeleccionadas([]);
      ApiGateway.doGet('/actividades')
        .then(res => {
          if (Array.isArray(res)) setCatalogoActividades(res);
          else if (res?.data && Array.isArray(res.data)) setCatalogoActividades(res.data);
        })
        .catch(console.warn);
    }
  }, [visible]);

  if (!visible || areaIdx === null || !areasActivas) return null;

  const area = areasActivas[areaIdx];
  const q = searchQuery.toLowerCase().trim();

  const disponibles = catalogoActividades.filter(a => {
    if (!q) return true;
    if (a.nombre?.toLowerCase().includes(q)) return true;
    return a.opciones?.some(o => typeof o === 'string' && o.toLowerCase().includes(q));
  });

  function toggleSeleccion(act) {
    setSeleccionadas(prev => {
      const existe = prev.find(s => s.nombre === act.nombre);
      if (existe) {
        return prev.filter(s => s.nombre !== act.nombre);
      } else {
        return [...prev, act];
      }
    });
  }

  function handleConfirmar() {
    onConfirmar(areaIdx, seleccionadas);
    setSearchQuery('');
    setSeleccionadas([]);
  }

  function handleClose() {
    setSearchQuery('');
    setSeleccionadas([]);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl p-5">
        <div className="flex items-start justify-between pb-4 border-b border-border flex-shrink-0">
          <div>
            <div className="text-base font-bold text-foreground">Agregar actividades</div>
            <div className="text-xs text-muted-foreground mt-0.5">{area?.nombre}</div>
          </div>
          <button onClick={handleClose} className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-3">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre u opción…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg outline-none bg-input-background focus:ring-2 focus:ring-ring"
            />
          </div>
          
          {disponibles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
              <div className="text-sm">No hay actividades disponibles para agregar.</div>
            </div>
          ) : (
            <div className="space-y-2">
              {disponibles.map(act => (
                <label key={act.nombre} className="flex items-start gap-3 p-3 border border-border rounded-lg hover:bg-accent/40 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mt-1 w-4 h-4 rounded border-border" 
                    checked={seleccionadas.some(s => s.nombre === act.nombre)}
                    onChange={() => toggleSeleccion(act)}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-foreground">{act.nombre}</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      {act.tipo === 'radio' ? 'Selección única' : act.tipo === 'checkbox' ? 'Selección múltiple' : 'Texto libre'}
                    </span>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {act.opciones?.slice(0,3).map(o => (
                        <span key={typeof o === 'string' ? o : o.etiqueta} className="px-1.5 py-0.5 rounded text-xs bg-muted text-muted-foreground border border-border">
                          {typeof o === 'string' ? o : o.etiqueta}
                        </span>
                      ))}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 pt-4 border-t border-border flex-shrink-0">
          <button onClick={handleClose} className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-accent">
            Cancelar
          </button>
          <button onClick={handleConfirmar} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90">
            Agregar seleccionadas {seleccionadas.length > 0 && `(${seleccionadas.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}
