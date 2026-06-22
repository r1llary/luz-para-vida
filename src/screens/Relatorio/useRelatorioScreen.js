import { useState, useEffect, useMemo, useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useCelulas } from '../../contexts/CelulasContext';
import { formatDateBr } from '../../utils/date';

export { formatDateBr };

const MONTH_NAMES_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
export const MONTH_NAMES_FULL = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export function useRelatorioScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const celula = params?.celula;
  const {
    getReunioesByCelula,
    fetchReunioesForCelula,
    getMembrosByCelula,
    fetchMembrosForCelula,
  } = useCelulas();

  const now = new Date();
  const [mes, setMes] = useState(now.getMonth() + 1);
  const [ano, setAno] = useState(now.getFullYear());
  const [activeTab, setActiveTab] = useState('frequencia');
  const [exportingPdf, setExportingPdf] = useState(false);

  const prevMonth = useCallback(() => {
    setMes((m) => {
      if (m === 1) {
        setAno((y) => y - 1);
        return 12;
      }
      return m - 1;
    });
  }, []);

  const nextMonth = useCallback(() => {
    setMes((m) => {
      if (m === 12) {
        setAno((y) => y + 1);
        return 1;
      }
      return m + 1;
    });
  }, []);

  useEffect(() => {
    if (celula?.id) {
      fetchReunioesForCelula(celula.id);
      fetchMembrosForCelula(celula.id);
    }
  }, [celula?.id, fetchReunioesForCelula, fetchMembrosForCelula]);

  const todas = celula ? getReunioesByCelula(celula.id) : [];
  const membros = celula ? getMembrosByCelula(celula.id) : [];

  const filtradas = useMemo(() => {
    if (!celula) return [];
    return todas
      .filter((r) => {
        const dr = r.dataReuniao;
        if (!dr || typeof dr !== 'string') return false;
        const parts = dr.split('-');
        return parseInt(parts[0], 10) === ano && parseInt(parts[1], 10) === mes;
      })
      .sort((a, b) =>
        String(b.dataReuniao || '').localeCompare(String(a.dataReuniao || ''))
      );
  }, [todas, ano, mes, celula]);

  const totais = useMemo(
    () => ({
      reunioes: filtradas.length,
      visitantes: filtradas.reduce((s, r) => s + (Number(r.visitantes) || 0), 0),
      membrosPresentes: filtradas.reduce((s, r) => {
        const ids = r.membrosPresentesIds;
        return s + (Array.isArray(ids) && ids.length > 0
          ? ids.length
          : Number(r.membrosPresentes) || 0);
      }, 0),
    }),
    [filtradas]
  );

  const visitantesList = useMemo(() => {
    const list = [];
    for (const r of filtradas) {
      const det = r.visitantesDetalhes;
      if (Array.isArray(det)) {
        for (const v of det) {
          if (v?.nome) {
            list.push({ nome: v.nome, contato: v.contato || '', reuniaoData: r.dataReuniao });
          }
        }
      }
    }
    return list;
  }, [filtradas]);

  const evolucaoVisitantes = useMemo(() => {
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const total = todas
        .filter((r) => {
          if (!r.dataReuniao) return false;
          const parts = r.dataReuniao.split('-');
          return parseInt(parts[0], 10) === y && parseInt(parts[1], 10) === m;
        })
        .reduce((s, r) => s + (Number(r.visitantes) || 0), 0);
      result.push({ label: `${MONTH_NAMES_SHORT[m - 1]}/${String(y).slice(-2)}`, total });
    }
    return result;
  }, [todas]);

  const frequencia = useMemo(() => {
    if (!membros.length) return [];
    const reunioesComIds = filtradas.filter(
      (r) => Array.isArray(r.membrosPresentesIds) && r.membrosPresentesIds.length > 0
    );
    if (!reunioesComIds.length) return [];
    return membros
      .map((m) => {
        const presencas = reunioesComIds.filter((r) =>
          r.membrosPresentesIds.includes(m.id)
        ).length;
        return {
          id: m.id,
          nome: m.nomeCompleto,
          presencas,
          total: reunioesComIds.length,
          pct: presencas / reunioesComIds.length,
        };
      })
      .sort((a, b) => b.pct - a.pct);
  }, [filtradas, membros]);

  const openReuniao = useCallback(
    (reuniao) => {
      navigation.navigate('CelulasTab', {
        screen: 'DetalheReuniao',
        params: { reuniao, celulaNome: celula?.nomeCelula },
      });
    },
    [navigation, celula?.nomeCelula]
  );

  const exportPdf = useCallback(async () => {
    if (!celula) return;
    setExportingPdf(true);
    try {
      const mesNome = MONTH_NAMES_FULL[mes - 1];

      const freqRows = frequencia
        .map(
          (f) => `<tr>
            <td>${f.nome}</td>
            <td style="text-align:center">${f.presencas}/${f.total}</td>
            <td style="text-align:center">${Math.round(f.pct * 100)}%</td>
          </tr>`
        )
        .join('');

      const visitRows = visitantesList
        .map(
          (v) => `<tr>
            <td>${v.nome}</td>
            <td>${v.contato || '—'}</td>
            <td>${formatDateBr(v.reuniaoData)}</td>
          </tr>`
        )
        .join('');

      const reuniaoRows = filtradas
        .map(
          (r) => `<tr>
            <td>${formatDateBr(r.dataReuniao)}</td>
            <td>${r.temaMinistrado || '—'}</td>
            <td style="text-align:center">${Number(r.visitantes) || 0}</td>
          </tr>`
        )
        .join('');

      const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<style>
  body { font-family: Arial, sans-serif; padding: 28px; color: #1e293b; font-size: 13px; }
  h1 { color: #C9A227; font-size: 20px; margin: 0 0 4px; }
  h2 { color: #334155; font-size: 14px; margin: 22px 0 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
  p { color: #475569; margin: 2px 0; }
  table { width: 100%; border-collapse: collapse; margin-top: 6px; }
  th { background: #C9A227; color: #fff; padding: 7px 10px; text-align: left; font-size: 12px; }
  td { padding: 6px 10px; border-bottom: 1px solid #e2e8f0; }
  tr:nth-child(even) td { background: #f8fafc; }
  .kpis { display: flex; gap: 12px; margin: 14px 0; }
  .kpi { flex: 1; background: #f1f5f9; border-radius: 8px; padding: 12px; text-align: center; }
  .kpi-n { font-size: 26px; font-weight: 800; color: #C9A227; line-height: 1.1; }
  .kpi-l { font-size: 11px; color: #64748b; margin-top: 3px; }
  footer { margin-top: 32px; color: #94a3b8; font-size: 10px; }
</style>
</head>
<body>
  <h1>Relatório Mensal — ${celula.nomeCelula}</h1>
  <p>Período: <strong>${mesNome}/${ano}</strong></p>
  <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
  <div class="kpis">
    <div class="kpi"><div class="kpi-n">${totais.reunioes}</div><div class="kpi-l">Reuniões</div></div>
    <div class="kpi"><div class="kpi-n">${totais.visitantes}</div><div class="kpi-l">Visitantes</div></div>
    <div class="kpi"><div class="kpi-n">${totais.membrosPresentes}</div><div class="kpi-l">Presenças</div></div>
  </div>
  ${freqRows ? `<h2>Frequência dos Membros</h2>
  <table><tr><th>Nome</th><th>Presenças</th><th>%</th></tr>${freqRows}</table>` : ''}
  ${visitRows ? `<h2>Visitantes do Mês</h2>
  <table><tr><th>Nome</th><th>Contato</th><th>Reunião</th></tr>${visitRows}</table>` : ''}
  ${reuniaoRows ? `<h2>Reuniões</h2>
  <table><tr><th>Data</th><th>Tema</th><th>Visitantes</th></tr>${reuniaoRows}</table>` : ''}
  <footer>Luz para Vida · Ana Rillary</footer>
</body>
</html>`;

      const { uri } = await Print.printToFileAsync({ html, base64: false });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Relatório ${celula.nomeCelula} — ${mesNome}/${ano}`,
        });
      } else {
        Alert.alert('PDF gerado', uri);
      }
    } catch (_) {
      Alert.alert('Erro', 'Não foi possível gerar o PDF.');
    } finally {
      setExportingPdf(false);
    }
  }, [celula, mes, ano, frequencia, visitantesList, filtradas, totais]);

  return {
    celula,
    mes,
    ano,
    prevMonth,
    nextMonth,
    filtradas,
    totais,
    frequencia,
    visitantesList,
    evolucaoVisitantes,
    formatDateBr,
    openReuniao,
    activeTab,
    setActiveTab,
    exportingPdf,
    exportPdf,
  };
}
