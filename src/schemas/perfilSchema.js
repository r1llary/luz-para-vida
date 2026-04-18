import { z } from 'zod';

export const edicaoPerfilSchema = z
  .object({
    nomeCompleto: z
      .string()
      .min(3, 'Nome deve ter no mínimo 3 caracteres'),
    dataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
    endereco: z.string().min(5, 'Endereço deve ter no mínimo 5 caracteres'),
    email: z
      .string()
      .min(1, 'Email é obrigatório')
      .email('Informe um email válido'),
    novaSenha: z.string().optional(),
    confirmarNovaSenha: z.string().optional(),
    senhaAtual: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const nova = data.novaSenha?.trim() ?? '';
    if (nova.length > 0) {
      if (nova.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Nova senha deve ter no mínimo 6 caracteres',
          path: ['novaSenha'],
        });
      }
      if (nova !== (data.confirmarNovaSenha ?? '')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'As senhas não coincidem',
          path: ['confirmarNovaSenha'],
        });
      }
    }
  });
