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
  dia: z.string().min(1, 'Dia é obrigatório'),
  horario: z.string().min(1, 'Horário é obrigatório'),
  membrosIniciais: z.array(membroInicialItem).optional(),
});

export const reuniaoSchema = z.object({
  dataReuniao: z
    .string()
    .min(1, 'Data é obrigatória')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use o formato AAAA-MM-DD'),
  temaMinistrado: z.string().min(1, 'Tema ministrado é obrigatório'),
  textoBase: z.string().optional(),
  visitantes: z.coerce.number().min(0, 'Deve ser 0 ou mais'),
  /** IDs dos membros da célula marcados como presentes */
  membrosPresentesIds: z.array(z.string()),
});

/** Relatório mensal: apenas escolha de período no formulário (filtro na tela). */
export const relatorioMensalSchema = z.object({
  ano: z.coerce.number().min(2000).max(2100),
  mes: z.coerce.number().min(1).max(12),
});
