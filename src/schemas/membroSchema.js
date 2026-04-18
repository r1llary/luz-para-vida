import { z } from 'zod';

export const registroMembroSchema = z.object({
  nomeCompleto: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Informe um email válido'),
  telefone: z
    .string()
    .min(10, 'Telefone deve ter no mínimo 10 caracteres'),
  rua: z.string().min(1, 'Rua é obrigatória'),
  numero: z.string().min(1, 'Número é obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(1, 'Bairro é obrigatório'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  cep: z
    .string()
    .min(8, 'CEP deve ter 8 dígitos')
    .max(9, 'CEP inválido'),
  data: z.string().min(1, 'Data é obrigatória'),
});
