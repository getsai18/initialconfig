import { useState } from 'react';
import { PlusCircle, Plus, Minus, AlertCircle } from 'lucide-react';
import { prendasCatalogo, tallasConfig } from '../../data/catalogos';

const genLabel = { hombre: 'Hombre', mujer: 'Mujer', niño: 'Niño' };

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-destructive">
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {msg}
    </div>
  );
}

export default function PrendasEditor({ clothesData, onChange, tiposDisponibles, readonly, minItems = 0 }) {
  const [clothTipo, setClothTipo] = useState('');
  const [generoSeleccionado, setGeneroSeleccionado] = useState('');
  const [clothTalla, setClothTalla] = useState('');
  const [clothQty, setClothQty] = useState('');
  const [qtyError, setQtyError] = useState('');
  const [camposError, setCamposError] = useState('');
  const [pendingRemoveClothId, setPendingRemoveClothId] = useState(null);

  const tallaOptions = tallasConfig[generoSeleccionado] || [];

  function handleQtyInput(val) {
    setQtyError('');
    if (val !== '' && !/^\d*$/.test(val)) {
      setQtyError('Solo se permiten números enteros');
      return;
    }
    if (val !== '' && parseInt(val, 10) > 999) {
      setQtyError('La cantidad no puede exceder 999');
      setClothQty('999');
      return;
    }
    setClothQty(val);
  }

  function agregarCloth() {
    setQtyError('');
    setCamposError('');
    const faltantes = [];
    if (!clothTipo) faltantes.push('Tipo de prenda');
    if (!generoSeleccionado) faltantes.push('Género');

    const prendaActiva = prendasCatalogo.find((p) => p.nombre === clothTipo);
    const esSinTalla = prendaActiva && ['🎒', '📦', '🧢', '🧦'].includes(prendaActiva.icono || prendaActiva.icon);
    const tallaFinal = esSinTalla ? 'Única' : clothTalla;
    if (!esSinTalla && !clothTalla) faltantes.push('Talla');

    const rawQty = clothQty.trim();
    if (!rawQty) {
      faltantes.push('Cantidad');
    } else if (!/^\d+$/.test(rawQty)) {
      setQtyError('La cantidad debe ser un número entero positivo (sin decimales)');
      if (faltantes.length) setCamposError(`Por favor completa: ${faltantes.join(', ')}.`);
      return;
    }

    if (faltantes.length) {
      setCamposError(`Por favor completa: ${faltantes.join(', ')}.`);
      return;
    }

    const qty = parseInt(rawQty, 10);
    if (qty <= 0) {
      setQtyError('La cantidad debe ser mayor a 0');
      return;
    }
    if (qty > 999) {
      setQtyError('La cantidad no puede exceder 999');
      return;
    }

    const existente = clothesData.find((c) => c.name === clothTipo && c.conf?.type === generoSeleccionado && c.conf?.size === tallaFinal);
    if (existente) {
      onChange(clothesData.map((c) =>
        c.name === clothTipo && c.conf?.type === generoSeleccionado && c.conf?.size === tallaFinal
          ? { ...c, conf: { ...c.conf, tot: c.conf.tot + qty } }
          : c
      ));
    } else {
      onChange([...clothesData, { id: 'c' + Date.now(), name: clothTipo, conf: { type: generoSeleccionado, size: tallaFinal, tot: qty } }]);
    }
    setClothTipo(''); setClothTalla(''); setClothQty('');
    setGeneroSeleccionado('');
  }

  function handleQuitarCloth(id) {
    if (clothesData.length <= minItems) return;
    if (pendingRemoveClothId === id) {
      onChange(clothesData.filter((c) => c.id !== id));
      setPendingRemoveClothId(null);
    } else {
      setPendingRemoveClothId(id);
    }
  }

  const catalogoOpciones = tiposDisponibles && tiposDisponibles.length > 0
    ? tiposDisponibles.map(name => {
        const found = prendasCatalogo.find(p => p.nombre === name);
        return found || { nombre: name, icono: '👕' };
      })
    : prendasCatalogo;

  return (
    <div className="space-y-4">
      {!readonly && (
        <div className="p-4 border border-border rounded-xl bg-card">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Prenda</label>
              <select
                value={clothTipo}
                onChange={e => setClothTipo(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-ring outline-none"
              >
                <option value="">Selecciona prenda...</option>
                {catalogoOpciones.map(p => (
                  <option key={p.nombre} value={p.nombre}>{p.icono} {p.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Género</label>
              <select
                value={generoSeleccionado}
                onChange={e => { setGeneroSeleccionado(e.target.value); setClothTalla(''); }}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-ring outline-none"
              >
                <option value="">Selecciona género...</option>
                <option value="hombre">Hombre</option>
                <option value="mujer">Mujer</option>
                <option value="niño">Niño</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Talla</label>
              <select
                value={clothTalla}
                onChange={e => setClothTalla(e.target.value)}
                disabled={!generoSeleccionado}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-ring outline-none disabled:opacity-50"
              >
                <option value="">Selecciona talla...</option>
                {tallaOptions.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Cantidad</label>
              <input
                type="text"
                value={clothQty}
                onChange={e => handleQtyInput(e.target.value)}
                placeholder="Ej. 12"
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-ring outline-none"
              />
            </div>
          </div>

          <FieldError msg={camposError || qtyError} />

          <div className="flex justify-end mt-3">
            <button
              type="button"
              onClick={agregarCloth}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
            >
              <Plus className="w-4 h-4" /> Agregar prenda
            </button>
          </div>
        </div>
      )}

      {/* Lista de prendas agregadas */}
      <div className="space-y-2">
        {clothesData.length === 0 ? (
          <div className="text-center py-8 border border-border rounded-xl bg-card text-muted-foreground text-sm">
            No se han agregado prendas aún.
          </div>
        ) : (
          clothesData.map(c => {
            const p = prendasCatalogo.find(pr => pr.nombre === c.name);
            return (
              <div key={c.id} className="flex items-center justify-between p-3 border border-border rounded-xl bg-card text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{p?.icono || '👕'}</span>
                  <div>
                    <span className="font-semibold text-foreground">{c.name}</span>
                    <span className="text-muted-foreground ml-2">({genLabel[c.conf?.type] || c.conf?.type || '—'}, Talla {c.conf?.size})</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-foreground">{c.conf?.tot} pzas</span>
                  {!readonly && (
                    <button
                      type="button"
                      onClick={() => handleQuitarCloth(c.id)}
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        pendingRemoveClothId === c.id
                          ? 'bg-destructive text-destructive-foreground font-bold'
                          : 'text-muted-foreground hover:text-destructive'
                      }`}
                    >
                      {pendingRemoveClothId === c.id ? '¿Confirmar?' : 'Quitar'}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
