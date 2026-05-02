import { z } from 'zod';
import { onlyDigits, parseDMYToISO } from '../utils/brFormat';
import { usuarioCadastroBase } from './authSchema';

/** Cadastro legado (apenas dados do membro, sem conta de usuário). */
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

/** Mesmo formulário que cadastro de usuário, sem senha (usa `MEMBRO_SENHA_PADRAO` no backend). */
const usuarioMembroSemSenhaBase = usuarioCadastroBase
  .omit({ senha: true, confirmarSenha: true })
  .extend({
    cpfRg: z.string().optional(),
    telefone: z.string().optional(),
  });

function chainMembroUsuario(schema) {
  return schema
    .superRefine((data, ctx) => {
      if (onlyDigits(data.cep).length !== 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'CEP deve ter 8 dígitos',
          path: ['cep'],
        });
      }
      if (!parseDMYToISO(data.dataNascimento)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Data inválida. Use dia/mês/ano (DD/MM/AAAA).',
          path: ['dataNascimento'],
        });
      }
      const tel = onlyDigits(data.telefone || '');
      if (data.telefone?.trim() && tel.length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Informe telefone com DDD (mín. 10 dígitos)',
          path: ['telefone'],
        });
      }
    });
}

/**
 * Membro com conta no app: mesmos campos do cadastro de usuário + CPF/RG e telefone opcionais.
 */
export const registroMembroUsuarioSchema = chainMembroUsuario(usuarioMembroSemSenhaBase);
