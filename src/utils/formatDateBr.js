/**
 * Data para exibição DD/MM/AAAA (Brasil).
 * Aceita ISO completo (ex.: 2026-05-02T00:00:00.000+00:00), só a parte data,
 * ou valores que `Date.parse` entenda.
 */
export function formatDateBr(value) {
  if (value == null || value === '') return '';
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return '';
    return toDdMmYyyy(value);
  }
  const s = String(value).trim();
  if (!s) return '';

  const isoDate = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoDate) {
    const [, y, m, d] = isoDate;
    return `${d}/${m}/${y}`;
  }

  const t = Date.parse(s);
  if (!Number.isNaN(t)) {
    return toDdMmYyyy(new Date(t));
  }

  return s;
}

function toDdMmYyyy(dt) {
  const d = String(dt.getDate()).padStart(2, '0');
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const y = dt.getFullYear();
  return `${d}/${m}/${y}`;
}
