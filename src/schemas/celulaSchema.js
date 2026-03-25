import { z } from 'zod';

export const registroCelulaSchema = z.object({
  nomeCelula: z
    .string()
    .min(2, 'Nome da célula deve ter no mínimo 2 caracteres'),
  local: z.string().min(1, 'Local é obrigatório'),
  endereco: z.string().min(1, 'Endereço é obrigatório'),
  dia: z.string().min(1, 'Dia é obrigatório'),
  horario: z.string().min(1, 'Horário é obrigatório'),
  celulaRaiz: z.string().optional(),
  temaMinistrado: z.string().optional(),
  textoBase: z.string().optional(),
  visitantes: z.coerce.number().min(0, 'Deve ser 0 ou mais').optional(),
  membrosPresentes: z.coerce.number().min(0, 'Deve ser 0 ou mais').optional(),
});

export const relatorioSchema = z.object({
  temaMinistrado: z.string().min(1, 'Tema ministrado é obrigatório'),
  textoBase: z.string().optional(),
  visitantes: z.coerce.number().min(0, 'Deve ser 0 ou mais'),
  membrosPresentes: z.coerce.number().min(0, 'Deve ser 0 ou mais'),
});
