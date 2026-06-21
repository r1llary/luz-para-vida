import { z } from 'zod';

const membroInicialItem = z.object({
  nomeCompleto: z.union([
    z.literal(''),
    z.string().min(3, 'Nome mínimo 3 caracteres'),
  ]),
  telefone: z.union([z.string(), z.undefined()]).optional(),
});

export const registroCelulaSchema = z.object({
  nomeCelula: z
    .string()
    .min(2, 'Nome da célula deve ter no mínimo 2 caracteres'),
  dia: z.enum(
    ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
    { errorMap: () => ({ message: 'Selecione o dia da semana' }) },
  ),
  horario: z.string().min(1, 'Horário é obrigatório'),
  local: z.string().optional(),
  membrosIniciais: z.array(membroInicialItem).optional(),
});

const visitanteSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  contato: z.string().optional().default(''),
});

export const reuniaoSchema = z.object({
  dataReuniao: z
    .string()
    .min(1, 'Data é obrigatória')
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Use o formato DD/MM/AAAA'),
  temaMinistrado: z.string().min(1, 'Tema ministrado é obrigatório'),
  textoBase: z.string().optional(),
  visitantesDetalhes: z.array(visitanteSchema).default([]),
  membrosPresentesIds: z.array(z.string()),
});

/** Relatório mensal: apenas escolha de período no formulário (filtro na tela). */
export const relatorioMensalSchema = z.object({
  ano: z.coerce.number().min(2000).max(2100),
  mes: z.coerce.number().min(1).max(12),
});
