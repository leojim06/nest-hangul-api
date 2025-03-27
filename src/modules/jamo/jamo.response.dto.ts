import { z } from 'zod';

export const jamoResponseSchema = z.object({
  id: z.string().uuid(),
  character: z.string(),
  name: z.string(),
  romajiName: z.string().optional(),
  category: z.enum([
    'Vocal',
    'Vocal Doble',
    'Consonante',
    'Consonante Derivada',
    'Consonante Doble',
    'Grupo Consonantico',
  ]),
  img: z.string().optional(),
  audio: z.string().optional(),
});

export type JamoResponseDto = z.infer<typeof jamoResponseSchema>;
