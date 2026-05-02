/** Apenas dígitos */
export function onlyDigits(value) {
  return String(value ?? '').replace(/\D/g, '');
}

/**
 * Máscara DD/MM/AAAA (4 dígitos no ano), até 10 caracteres.
 */
export function maskDateDMY(raw) {
  const d = onlyDigits(raw).slice(0, 8);
  const parts = [];
  if (d.length >= 2) parts.push(d.slice(0, 2));
  else if (d.length > 0) return d;
  if (d.length >= 4) parts.push(d.slice(2, 4));
  else if (d.length > 2) parts.push(d.slice(2));
  if (d.length > 4) parts.push(d.slice(4, 8));
  return parts.join('/');
}

/**
 * Máscara CEP 00000-000
 */
export function maskCEP(raw) {
  const d = onlyDigits(raw).slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

/**
 * Converte DD/MM/AAAA para ISO YYYY-MM-DD se a data for válida no calendário.
 */
export function parseDMYToISO(dmy) {
  const d = onlyDigits(dmy);
  if (d.length !== 8) return null;
  const day = Number(d.slice(0, 2));
  const month = Number(d.slice(2, 4));
  const year = Number(d.slice(4, 8));
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  if (year < 1000 || year > 9999) return null;
  const dt = new Date(year, month - 1, day);
  if (
    dt.getFullYear() !== year ||
    dt.getMonth() !== month - 1 ||
    dt.getDate() !== day
  ) {
    return null;
  }
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

/** Converte `YYYY-MM-DD` para exibição `DD/MM/AAAA`. */
export function formatIsoDateBr(iso) {
  if (!iso || typeof iso !== 'string') return '';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return String(iso);
  return `${d}/${m}/${y}`;
}

/** `YYYY-MM-DD` → `Date` local (meia-noite). */
export function isoDateToLocalDate(iso) {
  if (!iso || typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    return new Date();
  }
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** `Date` local → `YYYY-MM-DD`. */
export function localDateToIso(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayIsoDate() {
  return localDateToIso(new Date());
}
