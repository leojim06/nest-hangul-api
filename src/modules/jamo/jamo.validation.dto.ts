import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export class CreateJamoDto {
  @ApiProperty({
    example: 'ㅏ',
    description: 'El carácter en Hangul',
    type: String,
    minLength: 1,
    maxLength: 1,
    required: true,
  })
  character: string;

  @ApiProperty({
    example: 'a',
    description: 'Nombre del Jamo',
    type: String,
    required: true,
  })
  name: string;

  @ApiProperty({
    example: 'a',
    description: 'Pronunciación del Jamo en alfabeto latino',
    type: String,
    required: true,
  })
  pronunciation: string;

  @ApiProperty({
    example: 'a',
    description: 'Nombre del Jamo en alfabeto latino',
    type: String,
    required: true,
  })
  romajiName: string;

  @ApiProperty({
    example: 'Vocal',
    description: 'Categoría del Jamo',
    enum: [
      'Vocal',
      'Vocal Doble',
      'Consonante',
      'Consonante Derivada',
      'Consonante Doble',
      'Grupo Consonántico',
    ],
  })
  category: string;

  @ApiProperty({
    example: 'jamo-image.png',
    description: 'Archivo de imagen asociado al Jamo',
    type: String,
    required: false,
  })
  img: string;

  @ApiProperty({
    example: 'jamo-audio.mp3',
    description: 'Archivo de audio asociado al Jamo',
    type: String,
    required: false,
  })
  audio: string;
}

export class UpdateJamoDto {
  @ApiProperty({
    example: 'ㅏ',
    description: 'El carácter en Hangul',
    type: String,
    minLength: 1,
    maxLength: 1,
    required: false,
  })
  character: string;

  @ApiProperty({
    example: 'a',
    description: 'Nombre del Jamo',
    type: String,
    required: false,
  })
  name: string;

  @ApiProperty({
    example: 'a',
    description: 'Pronunciación del Jamo en alfabeto latino',
    type: String,
    required: false,
  })
  pronunciation: string;

  @ApiProperty({
    example: 'a',
    description: 'Nombre del Jamo en alfabeto latino',
    type: String,
    required: false,
  })
  romajiName: string;

  @ApiProperty({
    example: 'Vocal',
    description: 'Categoría del Jamo',
    enum: [
      'Vocal',
      'Vocal Doble',
      'Consonante',
      'Consonante Derivada',
      'Consonante Doble',
      'Grupo Consonántico',
    ],
  })
  category: string;

  @ApiProperty({
    example: 'jamo-image.png',
    description: 'Archivo de imagen asociado al Jamo',
    type: String,
    required: false,
  })
  img: string;

  @ApiProperty({
    example: 'jamo-audio.mp3',
    description: 'Archivo de audio asociado al Jamo',
    type: String,
    required: false,
  })
  audio: string;
}

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
