/** Métricas de frequência alinhadas à lista de relatórios e ao PDF. */

export function countPresencasReuniao(r) {
  const ids = r.membrosPresentesIds;
  if (Array.isArray(ids) && ids.length > 0) return ids.length;
  return Number(r.membrosPresentes) || 0;
}

export function visitantesStatsFromReunioes(reunioes) {
  const nomeToReuniaoIds = new Map();
  let registros = 0;

  reunioes.forEach((r) => {
    const lista = Array.isArray(r.visitantesLista) ? r.visitantesLista : [];
    if (lista.length > 0) {
      registros += lista.length;
      lista.forEach((v) => {
        const key = String(v?.nome ?? '')
          .trim()
          .toLowerCase();
        if (!key) return;
        if (!nomeToReuniaoIds.has(key)) nomeToReuniaoIds.set(key, new Set());
        nomeToReuniaoIds.get(key).add(r.id);
      });
    } else {
      registros += Number(r.visitantes) || 0;
    }
  });

  let visitantesRecorrentes = 0;
  nomeToReuniaoIds.forEach((ids) => {
    if (ids.size > 1) visitantesRecorrentes += 1;
  });

  const comNome = nomeToReuniaoIds.size > 0;
  const numeroVisitantes = comNome ? nomeToReuniaoIds.size : registros;

  return {
    numeroVisitantes,
    visitantesRecorrentes,
    registrosVisitantes: registros,
  };
}

export function membrosCountForCelula(celulaId, membrosGlobal) {
  return membrosGlobal.filter((m) => m.celulaId === celulaId).length;
}

/**
 * @param {boolean} params.isTodasCelulas
 * @param {object[]} params.elegiveis
 * @param {object[]} params.membrosGlobal
 * @param {number} params.membrosListaLength — quando uma célula só
 * @param {object[]} params.reunioesNoPeriodo
 */
export function computeFrequenciaStats({
  isTodasCelulas,
  elegiveis,
  membrosGlobal,
  membrosListaLength,
  reunioesNoPeriodo,
}) {
  let totalMembros;
  if (isTodasCelulas) {
    totalMembros = elegiveis.reduce(
      (s, c) => s + membrosCountForCelula(c.id, membrosGlobal),
      0,
    );
  } else {
    totalMembros = membrosListaLength;
  }
  const somaPresencas = reunioesNoPeriodo.reduce(
    (s, r) => s + countPresencasReuniao(r),
    0,
  );
  const reunioesCount = reunioesNoPeriodo.length;
  const totalSlots = totalMembros * reunioesCount;
  const taxaFrequenciaPct =
    totalSlots > 0
      ? Math.round((1000 * somaPresencas) / totalSlots) / 10
      : null;

  const { numeroVisitantes, visitantesRecorrentes } =
    visitantesStatsFromReunioes(reunioesNoPeriodo);

  return {
    totalMembros,
    somaPresencas,
    reunioesCount,
    totalSlots,
    taxaFrequenciaPct,
    numeroVisitantes,
    visitantesRecorrentes,
  };
}

/** Resumo simples para cartões na tela de detalhe do relatório. */
export function computeTotaisResumo(filtradas) {
  const { numeroVisitantes } = visitantesStatsFromReunioes(filtradas);
  const membrosPresentes = filtradas.reduce((s, r) => {
    const ids = r.membrosPresentesIds;
    const n =
      Array.isArray(ids) && ids.length > 0
        ? ids.length
        : Number(r.membrosPresentes) || 0;
    return s + n;
  }, 0);
  return {
    reunioes: filtradas.length,
    visitantes: numeroVisitantes,
    membrosPresentes,
  };
}
