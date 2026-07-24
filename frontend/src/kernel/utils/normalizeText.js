/** Minúsculas y sin acentos, para comparar texto de forma tolerante. */
export function normalizeText(value) {
  return (value ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}
