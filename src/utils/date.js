/** DD/MM/AAAA → YYYY-MM-DD para armazenamento */
export function toISODate(br) {
  const match = String(br).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (match) return `${match[3]}-${match[2]}-${match[1]}`;
  return br;
}

/** YYYY-MM-DD → DD/MM/AAAA para exibição */
export function formatDateBr(iso) {
  if (!iso || typeof iso !== 'string') return '';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return String(iso);
  return `${d}/${m}/${y}`;
}

/** YYYY-MM-DD ou YYYY/MM/DD → DD/MM/AAAA (para pré-preencher campos) */
export function toDisplayDate(stored) {
  if (!stored) return '';
  const iso = String(stored).replace(/\//g, '-');
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) return `${match[3]}/${match[2]}/${match[1]}`;
  return stored;
}
