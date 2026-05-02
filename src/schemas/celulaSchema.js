import { z } from 'zod';
import { DIAS_SEMANA_OPCOES } from '../constants/diasSemana';

export const registroCelulaSchema = z.object({
  nomeCelula: z
    .string()
    .trim()
    .min(2, 'Nome da célula deve ter no mínimo 2 caracteres'),
  local: z
    .string()
    .trim()
    .min(2, 'Informe o local (ex.: residência, salão)'),
  endereco: z
    .string()
    .trim()
    .min(5, 'Informe o endereço completo'),
  dia: z
    .string()
    .trim()
    .refine((s) => DIAS_SEMANA_OPCOES.includes(s), {
      message: 'Selecione o dia da semana',
    }),
  horario: z
    .string()
    .trim()
    .regex(
      /^([01]\d|2[0-3]):[0-5]\d[hH]$/,
      'Selecione o horário (formato 24h, ex.: 19:30h)',
    ),
  celulaRaiz: z.string().trim().optional(),
});

/**
 * Item da lista na nova reunião — espelha a collection `visitante`
 * (`celulaId` / `reuniaoId` preenchidos ao gravar a reunião no Appwrite).
 */
const visitanteReuniaoSchema = z.object({
  nome: z.string().trim().min(1, 'Nome é obrigatório'),
  telefone: z.string().trim().optional(),
  observacoes: z.string().trim().optional(),
});

/** Alinhado à collection `reuniao`: data (ISO), tema, observacoes, membrosPresentes, visitantes. */
export const reuniaoSchema = z.object({
  /** ISO `YYYY-MM-DD` — gravado como `data` no Appwrite. */
  dataReuniao: z
    .string()
    .min(1, 'Data é obrigatória')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  /** Texto — gravado como `tema`. */
  temaMinistrado: z.string().min(1, 'Tema é obrigatório'),
  /** Observações — gravado como `observacoes`. */
  textoBase: z.string().optional(),
  /** Lista para criar documentos em `visitante` (nome, telefone?, observacoes?). */
  visitantesLista: z.array(visitanteReuniaoSchema).default([]),
  /** Auth user IDs dos membros presentes (mesmos IDs que `celulas.membros[]`). */
  membrosPresentesIds: z.array(z.string()),
});

/** Relatório mensal: apenas escolha de período no formulário (filtro na tela). */
export const relatorioMensalSchema = z.object({
  ano: z.coerce.number().min(2000).max(2100),
  mes: z.coerce.number().min(1).max(12),
});
