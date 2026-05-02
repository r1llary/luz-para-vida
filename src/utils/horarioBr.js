/**
 * Formato exibido e salvo: "19:30h" (24h, dois dígitos em hora e minuto).
 */
export function formatHorarioBr(date) {
  if (!date || Number.isNaN(date.getTime?.())) {
    return '19:30h';
  }
  const h = date.getHours();
  const m = date.getMinutes();
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}h`;
}

/**
 * Interpreta "19:30h", "19:30", "9:5h" etc. para Date do dia corrente.
 */
export function parseHorarioToDate(horarioStr) {
  const s = String(horarioStr || '').trim();
  const m = s.match(/^(\d{1,2})\s*:\s*(\d{1,2})\s*h?$/i);
  const d = new Date();
  if (m) {
    let hh = Number(m[1]);
    const mm = Number(m[2]);
    if (hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59) {
      d.setHours(hh, mm, 0, 0);
      return d;
    }
  }
  d.setHours(19, 30, 0, 0);
  return d;
}
