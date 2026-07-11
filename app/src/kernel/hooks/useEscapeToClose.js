import { useEffect } from 'react';

/**
 * Cierra con Escape la capa (modal) de mayor prioridad que esté abierta.
 * `layers` es una lista ordenada de [valor, cerrar] — se cierra solo la primera
 * capa cuyo valor sea verdadero.
 */
export function useEscapeToClose(layers) {
  const values = layers.map(([value]) => value);

  useEffect(() => {
    function onKey(e) {
      if (e.key !== 'Escape') return;
      for (const [value, close] of layers) {
        if (value) {
          close();
          return;
        }
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, values);
}
