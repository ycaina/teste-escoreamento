import { z } from 'zod';

export const clientSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),
  email: z
    .string()
    .email('E-mail inválido')
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .regex(/^[\d\s\-\(\)\+]+$/, 'Telefone inválido')
    .optional()
    .or(z.literal('')),
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'Arquivo deve ter no máximo 10MB')
    .refine(
      (file) => {
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/jpg',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        return allowedTypes.includes(file.type);
      },
      'Tipo de arquivo não permitido. Use: JPG, PNG, PDF ou DOC'
    )
});

export type ClientFormData = z.infer<typeof clientSchema>;
