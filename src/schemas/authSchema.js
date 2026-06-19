import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Informe um email válido'),
  senha: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export const registroUsuarioSchema = z.object({
  nomeCompleto: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres'),
  dataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  endereco: z.string().min(5, 'Endereço deve ter no mínimo 5 caracteres'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Informe um email válido'),
  senha: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmarSenha: z.string(),
  permissao: z.enum(['membro', 'lider']).default('membro'),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarSenha'],
});
