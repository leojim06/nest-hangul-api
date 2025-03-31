import { z } from 'zod';

export const AudioResponseSchema = z.object({
  id: z.string().uuid(),
  character: z.string(),
  type: z.string(),
  url: z.string().url(),
});

export type AudioResponseDto = z.infer<typeof AudioResponseSchema>;
