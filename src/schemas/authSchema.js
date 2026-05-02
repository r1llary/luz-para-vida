import { z } from 'zod';
import { onlyDigits, parseDMYToISO } from '../utils/brFormat';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Informe um email válido'),
  senha: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export const usuarioCadastroBase = z.object({
  nomeCompleto: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres'),
  dataNascimento: z
    .string()
    .min(1, 'Data de nascimento é obrigatória'),
  cep: z.string().min(1, 'CEP é obrigatório'),
  enderecoBase: z
    .string()
    .min(5, 'Busque o endereço pelo CEP ou preencha o campo'),
  numero: z.string().min(1, 'Número é obrigatório'),
  complemento: z.string().optional(),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Informe um email válido'),
  senha: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmarSenha: z.string(),
});

export function chainUsuarioCadastro(schema) {
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
    })
    .refine((data) => data.senha === data.confirmarSenha, {
      message: 'As senhas não coincidem',
      path: ['confirmarSenha'],
    });
}

/** Cadastro de conta: mesmo formulário base (documento `usuarios` recebe `celulas: []` no backend). */
export const registroUsuarioSchema = chainUsuarioCadastro(usuarioCadastroBase);
