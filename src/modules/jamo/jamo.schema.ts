import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type JamoDocument = Jamo & Document;

@Schema({ timestamps: true })
export class Jamo {
  @Prop({
    default: uuidv4, // Genera un UUID automáticamente
    unique: true,
    index: true, // Agrega un índice para mejorar la búsqueda
  })
  id: string; // Identificador único del jamo

  @Prop({
    required: [true, 'El caracter es obligatorio'],
    unique: true,
    trim: true,
  })
  character: string; // Letra del alfabeto coreano

  @Prop({ required: true })
  name: string; // Nombre del carácter

  @Prop({ required: true })
  pronunciation: string; // Pronunciación en romanización

  @Prop({
    required: true,
    enum: [
      'Vocal',
      'Vocal Doble',
      'Consonante',
      'Consonante Derivada',
      'Consonante Doble',
      'Grupo Consonantico',
    ],
  })
  category: string; // Tipo (vocal, consonante, etc.)

  @Prop()
  romajiName?: string; // Propiedad name en alfabeto latino (opcional)

  @Prop()
  img?: string; // Ruta del archivo de imagen (opcional)

  @Prop()
  audio?: string; // Ruta del archivo de audio (opcional)
}

export const JamoSchema = SchemaFactory.createForClass(Jamo);
