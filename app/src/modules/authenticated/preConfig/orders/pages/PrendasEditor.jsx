import { useState } from 'react';
import { PlusCircle, Plus, Minus, AlertCircle } from 'lucide-react';
import { prendasCatalogo, tallasConfig } from '../../data/catalogos';

const genLabel = { hombre: 'Hombre', mujer: 'Mujer', niño: 'Niño' };

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600">
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

    const existente = clothesData.find((c) => c.name === clothTipo && c.conf.type === generoSeleccionado && c.conf.size === tallaFinal);
    if (existente) {
      onChange(clothesData.map((c) =>
        c.name === clothTipo && c.conf.type === generoSeleccionado && c.conf.size === tallaFinal
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

  function handleAjustarCantidad(id, delta) {
    onChange(clothesData.map((c) => {
      if (c.id !== id) return c;
      const nuevo = Math.min(999, Math.max(1, c.conf.tot + delta));
      return { ...c, conf: { ...c.conf, tot: nuevo } };
    }));
  }

  const cardsGrid = clothesData.length === 0 ? (
    <div className="text-center p-8 border border-dashed border-gray-200 rounded-xl text-sm text-gray-400">
      Sin prendas agregadas todavía.<br />Usa el formulario para agregar.
    </div>
  ) : (
    <div className="clothes-cards-grid">
      {clothesData.map((c) => (
        <div key={c.id} className="cloth-card">
          {!readonly && (
            pendingRemoveClothId === c.id ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/95 backdrop-blur-[2px] rounded-xl border border-red-200 shadow-sm z-20">
  <span className="text-xs sm:text-sm text-gray-700 font-semibold">¿Quitar prenda?</span>
  <div className="flex gap-3">
    <button onClick={() => handleQuitarCloth(c.id)} className="text-xs sm:text-sm font-bold text-white bg-red-500 px-5 py-2 rounded-lg hover:bg-red-600 active:scale-95 transition-all shadow-sm">
      Sí
    </button>
    <button onClick={() => setPendingRemoveClothId(null)} className="text-xs sm:text-sm font-bold text-gray-700 bg-gray-100 border border-gray-200 px-5 py-2 rounded-lg hover:bg-gray-200 active:scale-95 transition-all shadow-sm">
      No
    </button>
  </div>
</div>
            ) : clothesData.length <= minItems ? (
              <button
                className="absolute top-1.5 right-1.5 text-gray-200 p-1 rounded text-xs cursor-not-allowed"
                disabled
                title={`La orden debe tener al menos ${minItems} prenda${minItems === 1 ? '' : 's'}`}
              >
                ✕
              </button>
            ) : (
              <button
                className="absolute top-1.5 right-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 p-1 rounded text-xs transition-colors"
                onClick={() => setPendingRemoveClothId(c.id)}
              >
                ✕
              </button>
            )
          )}
          {readonly ? (
            <div className="cloth-qty">{c.conf.tot}</div>
          ) : (
            <div className="qty-stepper qty-stepper-card">
              <button
                type="button"
                className="qty-stepper-btn bg-primary text-white hover:bg-black active:scale-95 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all rounded"
                onClick={() => handleAjustarCantidad(c.id, -1)}
                disabled={c.conf.tot <= 1}
                aria-label="Disminuir cantidad"
              >
                <Minus  className="w-4 h-4 font-bold stroke-[4px] " />
              </button>
              <div className="qty-stepper-input qty-stepper-input-card">{c.conf.tot}</div>
              <button
                type="button"
                className="qty-stepper-btn"
                onClick={() => handleAjustarCantidad(c.id, 1)}
                disabled={c.conf.tot >= 999}
                aria-label="Aumentar cantidad"
              >
                <Plus className="w-3.5 h-3.5 stroke-[4px]" />
              </button>
            </div>
          )}
          <div className="cloth-name">{c.name}</div>
          <div className="cloth-badges">
            <span className="cloth-badge-gen">{genLabel[c.conf.type] || c.conf.type}</span>
            <span className="cloth-badge-talla">{c.conf.size}</span>
          </div>
        </div>
      ))}
    </div>
  );

  if (readonly) return cardsGrid;

  return (
    <div className="clothes-layout">
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div className="text-sm font-semibold mb-4 flex items-center gap-2 text-gray-800">
          <PlusCircle className="w-4 h-4 text-gray-500" /> Agregar prenda
        </div>
        <div className="mb-3">
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Tipo de prenda</label>
          <select value={clothTipo} onChange={e => setClothTipo(e.target.value)} className="field-input">
            <option value="">Seleccionar…</option>
            {tiposDisponibles.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="mb-3">
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Género</label>
          <div className="tag-group">
            {['hombre', 'mujer', 'niño'].map(gen => (
              <div key={gen} className={`tag-option${generoSeleccionado === gen ? ' selected' : ''}`} onClick={() => setGeneroSeleccionado(gen)}>
                {gen.charAt(0).toUpperCase() + gen.slice(1)}
              </div>
            ))}
          </div>
        </div>

        {(() => {
          const prendaActivaUI = prendasCatalogo.find((p) => p.nombre === clothTipo);
          const ocultarTalla = prendaActivaUI && ['🎒', '📦', '🧢', '🧦'].includes(prendaActivaUI.icono || prendaActivaUI.icon);
          if (ocultarTalla) return null;
          return (
            <div className="mb-3">
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Talla</label>
              <select value={clothTalla} onChange={e => setClothTalla(e.target.value)} className="field-input">
                <option value="">Seleccionar…</option>
                {tallaOptions.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          );
        })()}

        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
            Cantidad <span className="text-gray-400 font-normal normal-case">(entero, 1–999)</span>
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={clothQty}
            onChange={e => handleQtyInput(e.target.value)}
            placeholder="0"
            className={`field-input ${qtyError ? 'border-red-400 bg-red-50' : ''}`}
          />
          <FieldError msg={qtyError} />
        </div>
        <button onClick={agregarCloth} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-[#050314] text-white rounded-lg hover:bg-gray-800">
          <Plus className="w-4 h-4" /> Agregar
        </button>
        <FieldError msg={camposError} />
      </div>

      <div>{cardsGrid}</div>
    </div>
  );
}
