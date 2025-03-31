import { z } from 'zod';
import { JamoType } from './jamo.schema';
import { AudioResponseSchema } from './audio.response.dto';

const transformTypeEnum = (type?: JamoType): string => {
  if (!type) return '';
  const castedType = type as unknown as JamoType;
  return Object.values(JamoType).includes(castedType) ? castedType : '';
};

export const JamoResponseSchema = z
  .object({
    id: z.string().uuid(),
    character: z.string(),
    name: z.string(),
    type: z.nativeEnum(JamoType),
    character_romaji: z.string().optional(),
    name_romaji: z.string().optional(),
    pronunciation: z.string().optional(),
    imageUrl: z.string().url().optional(),
    audios: z.array(AudioResponseSchema).default([]),
  })
  .transform((data) => ({
    ...data,
    characterRomaji: data.character_romaji,
    nameRomaji: data.name_romaji,
    type: transformTypeEnum(data.type),
  }));

export type JamoResponseDto = z.infer<typeof JamoResponseSchema>;
