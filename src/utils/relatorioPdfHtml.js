import { formatDateBr } from './formatDateBr';

function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function visitantesReuniao(r) {
  const lista = Array.isArray(r.visitantesLista) ? r.visitantesLista : [];
  if (lista.length > 0) return lista.length;
  return Number(r.visitantes) || 0;
}

function membrosPresentesReuniao(r) {
  const ids = r.membrosPresentesIds;
  if (Array.isArray(ids) && ids.length > 0) return ids.length;
  return Number(r.membrosPresentes) || 0;
}

const SIZE = 200;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 78;

function polarToCartesian(cx, cy, radius, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

function slicePath(cx, cy, rInner, startDeg, endDeg) {
  if (endDeg - startDeg <= 0.01) return '';
  const start = polarToCartesian(cx, cy, rInner, endDeg);
  const end = polarToCartesian(cx, cy, rInner, startDeg);
  const largeArc = endDeg - startDeg <= 180 ? 0 : 1;
  return [
    'M',
    cx,
    cy,
    'L',
    start.x,
    start.y,
    'A',
    rInner,
    rInner,
    0,
    largeArc,
    0,
    end.x,
    end.y,
    'Z',
  ].join(' ');
}

/**
 * Gráfico de pizza (frequência) em SVG para embutir no HTML do PDF.
 */
export function buildFrequencyPieSvg(somaPresencas, totalSlots) {
  const pres = Math.max(0, Number(somaPresencas) || 0);
  const slots = Math.max(0, Number(totalSlots) || 0);
  const colorP = '#22c55e';
  const colorA = 'rgba(30,41,59,0.55)';

  if (slots <= 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}"><circle cx="${CX}" cy="${CY}" r="${R}" fill="${colorA}"/></svg>`;
  }
  const aus = Math.max(0, slots - pres);
  const fracP = Math.min(1, pres / slots);
  const angleP = fracP * 360;
  const pathP = angleP > 0.01 ? slicePath(CX, CY, R, 0, angleP) : '';
  const pathA = aus > 0 ? slicePath(CX, CY, R, angleP, 360) : '';

  if (pres <= 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}"><circle cx="${CX}" cy="${CY}" r="${R}" fill="${colorA}"/></svg>`;
  }
  if (pres >= slots) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}"><circle cx="${CX}" cy="${CY}" r="${R}" fill="${colorP}"/></svg>`;
  }

  let inner = '';
  if (pathA) inner += `<path d="${pathA}" fill="${colorA}"/>`;
  if (pathP) inner += `<path d="${pathP}" fill="${colorP}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">${inner}</svg>`;
}

const PDF_CSS = `
  * { box-sizing: border-box; }
  body { font-family: system-ui, -apple-system, sans-serif; font-size: 10.5px; color: #1e293b; padding: 18px; max-width: 800px; margin: 0 auto; }
  h1 { font-size: 17px; margin: 0 0 6px 0; color: #0f172a; }
  .brand { color: #b45309; font-size: 12px; font-weight: 700; margin-bottom: 14px; }
  .meta { color: #64748b; margin-bottom: 6px; font-size: 10px; line-height: 1.45; }
  h2 { font-size: 13px; margin: 18px 0 8px 0; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 10px; }
  th, td { border: 1px solid #cbd5e1; padding: 5px 7px; text-align: left; vertical-align: top; }
  th { background: #f1f5f9; font-weight: 700; }
  .section-chart { margin-top: 22px; page-break-inside: avoid; border-top: 1px solid #e2e8f0; padding-top: 14px; }
  .chart-title { font-size: 13px; font-weight: 800; margin-bottom: 8px; color: #0f172a; }
  .chart-stats { font-size: 10px; line-height: 1.55; color: #334155; margin: 10px 0; }
  .chart-stats strong { color: #0f172a; }
  .legend { font-size: 9px; color: #64748b; margin-top: 8px; text-align: center; }
`;

/**
 * @param {object} opts
 * @param {{ inicio: string, fim: string }} opts.periodoOrdenado
 * @param {string} opts.filtroLabel — ex.: nome da célula ou "Todas as células"
 * @param {Array<{ nomeCelula: string, reunioes: object[] }>} opts.grupos
 * @param {object} opts.stats — frequenciaStats compatível com RelatoriosLista
 */
export function buildRelatorioPdfHtml({
  periodoOrdenado,
  filtroLabel,
  grupos,
  stats,
}) {
  const pInicio = formatDateBr(periodoOrdenado.inicio) || periodoOrdenado.inicio;
  const pFim = formatDateBr(periodoOrdenado.fim) || periodoOrdenado.fim;

  let bodyTables = '';
  for (const g of grupos) {
    const nome = escapeHtml(g.nomeCelula);
    bodyTables += `<h2>${nome}</h2><table><thead><tr><th>Data</th><th>Tema</th><th>Visitantes</th><th>Membros presentes</th></tr></thead><tbody>`;
    const rows = Array.isArray(g.reunioes) ? g.reunioes : [];
    if (rows.length === 0) {
      bodyTables +=
        '<tr><td colspan="4">Nenhuma reunião neste período.</td></tr>';
    } else {
      for (const r of rows) {
        const dr = r.dataReuniao || r.data;
        const dataStr = escapeHtml(formatDateBr(dr) || dr || '—');
        const tema = escapeHtml(r.temaMinistrado || '—');
        const v = visitantesReuniao(r);
        const m = membrosPresentesReuniao(r);
        bodyTables += `<tr><td>${dataStr}</td><td>${tema}</td><td>${v}</td><td>${m}</td></tr>`;
      }
    }
    bodyTables += '</tbody></table>';
  }

  const taxa =
    stats.taxaFrequenciaPct == null ? '—' : `${stats.taxaFrequenciaPct}%`;
  const pieSvg = buildFrequencyPieSvg(stats.somaPresencas, stats.totalSlots);

  const chartBlock = `
    <div class="section-chart">
      <div class="chart-title">Frequência geral no período</div>
      <div class="meta">Presenças vs vagas teóricas (membros × reuniões). Mesma lógica do app.</div>
      <div style="text-align:center">${pieSvg}</div>
      <p class="legend">Verde: presenças · Cinza: ausências (vagas)</p>
      <div class="chart-stats">
        <div><strong>Reuniões:</strong> ${escapeHtml(String(stats.reunioesCount ?? 0))}</div>
        <div><strong>Membros (base):</strong> ${escapeHtml(String(stats.totalMembros ?? 0))}</div>
        <div><strong>Soma de presenças:</strong> ${escapeHtml(String(stats.somaPresencas ?? 0))}</div>
        <div><strong>Taxa de frequência:</strong> ${taxa}</div>
        <div><strong>Visitantes (métrica do período):</strong> ${escapeHtml(String(stats.numeroVisitantes ?? 0))}</div>
        <div><strong>Visitantes recorrentes:</strong> ${escapeHtml(String(stats.visitantesRecorrentes ?? 0))}</div>
      </div>
    </div>
  `;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>${PDF_CSS}</style></head><body>
    <div class="brand">Luz para a Vida</div>
    <h1>Relatório de reuniões</h1>
    <p class="meta"><strong>Período:</strong> ${escapeHtml(pInicio)} — ${escapeHtml(pFim)}</p>
    <p class="meta"><strong>Filtro:</strong> ${escapeHtml(filtroLabel)}</p>
    ${bodyTables}
    ${chartBlock}
  </body></html>`;
}
