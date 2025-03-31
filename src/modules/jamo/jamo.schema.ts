import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Audio } from './audio.schema';

export enum JamoType {
  VOCAL = 'Vocal',
  VOCAL_DOBLE = 'Vocal Doble',
  CONSONANTE = 'Consonante',
  CONSONANTE_DERIVADA = 'Consonante Derivada',
  CONSONANTE_DOBLE = 'Consonante Doble',
  GRUPO_CONSONANTICO = 'Grupo Consonántico',
}

@Schema({ timestamps: true })
export class Jamo {
  @Prop({
    type: String,
    default: () => uuidv4(),
    required: true,
  })
  _id: string; // Identificador único del jamo

  @Prop({
    required: [true, 'El caracter es obligatorio'],
    unique: true,
    trim: true,
  })
  character: string; // Letra del alfabeto coreano

  @Prop({
    required: [true, 'El nombre del caracter es obligatorio'],
    trim: true,
  })
  name: string; // Nombre del carácter en coreano

  @Prop({
    required: [true, 'El tipo de caracter es obligatorio'],
    enum: JamoType,
  })
  type: JamoType; // Tipo (vocal, consonante, etc.)

  @Prop({ required: false, trim: true })
  character_romaji: string; // Romanización del character del jamo

  @Prop({ required: false, trim: true })
  name_romaji: string; // Romanización del name del jamo

  @Prop({ required: false, trim: true })
  pronunciation: string; // Pronunciación

  @Prop({ required: false })
  imageUrl?: string; // URL de la imagen del jamo

  @Prop({ type: [{ type: String, ref: 'Audio' }], default: [] })
  audios: Audio[]; // Relación con los audios del jamo
}

// export type JamoDocument = HydratedDocument<Jamo>;
export type JamoDocument = Jamo & Document;
export const JamoSchema = SchemaFactory.createForClass(Jamo);

JamoSchema.set('id', true);
JamoSchema.set('toJSON', { virtuals: true });
JamoSchema.set('toObject', { virtuals: true });
