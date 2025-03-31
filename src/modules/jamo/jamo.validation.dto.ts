import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';
import { JamoType } from './jamo.schema';

export enum JamoTypeDto {
  VOCAL = 'Vocal',
  VOCAL_DOBLE = 'Vocal Doble',
  CONSONANTE = 'Consonante',
  CONSONANTE_DERIVADA = 'Consonante Derivada',
  CONSONANTE_DOBLE = 'Consonante Doble',
  GRUPO_CONSONANTICO = 'Grupo Consonántico',
}

export class CreateJamoDto {
  @ApiProperty({
    example: 'ㅏ',
    description: 'El carácter en Coreano',
    type: String,
    minLength: 1,
    maxLength: 2,
    required: true,
  })
  character: string;

  @ApiProperty({
    example: '아',
    description: 'Nombre del Jamo en Coreano',
    type: String,
    required: true,
  })
  name: string;

  @ApiProperty({
    example: 'Vocal',
    description: 'Tipo o categoría del Jamo',
    enum: JamoTypeDto,
    required: true,
  })
  type: string;

  @ApiProperty({
    example: 'a',
    description: 'Nombre del Jamo en alfabeto latino',
    type: String,
    required: false,
  })
  characterRomaji: string;

  @ApiProperty({
    example: 'a',
    description: 'Nombre del Jamo en alfabeto latino',
    type: String,
    required: false,
  })
  nameRomaji: string;

  @ApiProperty({
    example: '/ah/',
    description: 'Pronunciación del Jamo en alfabeto latino',
    type: String,
    required: false,
  })
  pronunciation: string;
}

export class UpdateJamoDto {
  @ApiProperty({
    example: 'ㅏ',
    description: 'El carácter en Coreano',
    type: String,
    minLength: 1,
    maxLength: 2,
    required: false,
  })
  character: string;

  @ApiProperty({
    example: '아',
    description: 'Nombre del Jamo en Coreano',
    type: String,
    required: false,
  })
  name: string;

  @ApiProperty({
    example: 'Vocal',
    description: 'Tipo o categoría del Jamo',
    enum: JamoTypeDto,
    required: false,
  })
  type: string;

  @ApiProperty({
    example: 'a',
    description: 'Nombre del Jamo en alfabeto latino',
    type: String,
    required: false,
  })
  characterRomaji: string;

  @ApiProperty({
    example: 'a',
    description: 'Nombre del Jamo en alfabeto latino',
    type: String,
    required: false,
  })
  nameRomaji: string;

  @ApiProperty({
    example: '/ah/',
    description: 'Pronunciación del Jamo en alfabeto latino',
    type: String,
    required: false,
  })
  pronunciation: string;
}

const transformTypeEnum = (type?: JamoTypeDto): JamoType | undefined => {
  if (!type) return undefined;
  const castedType = type as unknown as JamoType;
  return Object.values(JamoType).includes(castedType) ? castedType : undefined;
};

export const CreateJamoValidation = z
  .object({
    character: z
      .string()
      .min(1, { message: 'El carácter debe tener al menos 1 símbolo' })
      .max(2, { message: 'El carácter no puede tener más de 2 símbolos' }),
    name: z
      .string()
      .min(1, { message: 'El nombre del Jamo no puede estar vacío' }),
    type: z.nativeEnum(JamoTypeDto, {
      errorMap: () => ({ message: 'Tipo de Jamo inválido' }),
    }),
    characterRomaji: z.string().optional(),
    nameRomaji: z.string().optional(),
    pronunciation: z.string().optional(),
  })
  .transform((data) => ({
    ...data,
    type: transformTypeEnum(data.type),
    character_romaji: data.characterRomaji,
    name_romaji: data.nameRomaji,
    characterRomaji: undefined,
    nameRomaji: undefined,
  }));

export type CreateJamoDtoZod = z.infer<typeof CreateJamoValidation>;
export const UpdateJamoValidation = CreateJamoValidation._def.schema
  .partial()
  .transform((data) => ({
    ...data,
    type: transformTypeEnum(data.type),
    character_romaji: data.characterRomaji,
    name_romaji: data.nameRomaji,
  }));
export type UpdateJamoDtoZod = z.infer<typeof UpdateJamoValidation>;
