import { z } from 'zod';

export const createJamoValidation = z.object({
  character: z
    .string({ required_error: 'El caracter es requerido' })
    .trim()
    .min(1, { message: 'El caracter es obligatorio' })
    .max(2, { message: 'El caracter debe tener entre 1 y 2 caracteres' }),
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .min(1, { message: 'El nombre es obligatorio' }),
  pronunciation: z
    .string({ required_error: 'La pronunciacion es requerida' })
    .min(1, { message: 'La pronunciacion es obligatoria' }),
  romajiName: z.string().optional(),
  category: z.enum(
    [
      'Vocal',
      'Vocal Doble',
      'Consonante',
      'Consonante Derivada',
      'Consonante Doble',
      'Grupo Consonantico',
    ],
    {
      errorMap: () => ({ message: 'Categoría invalida' }),
    },
  ),
  img: z.string().optional(),
  audio: z.string().optional(),
});

export const updateJamoValidation = createJamoValidation.partial();
