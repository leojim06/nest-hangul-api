import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export enum AudioType {
  MASCULINO = 'Masculino',
  FEMENINO = 'Femenino',
  COMBINADO = 'Combinado', // Para consonantes combinadas con vocales
}

@Schema({ timestamps: true })
export class Audio {
  @Prop({
    type: String,
    default: () => uuidv4(),
    required: true,
  })
  _id: string;

  @Prop({ type: String, ref: 'Jamo', required: true })
  jamoId: string; // Relación con el Jamo al que pertenece el audio

  @Prop({ required: true })
  character: string; // Representa el carácter del jamo en el audio

  @Prop({ required: true, enum: AudioType })
  type: AudioType; // Tipo de audio (masculino, femenino, combinado)

  @Prop({ type: String, ref: 'Jamo', required: false })
  combinedWith?: string; // Para consonantes combinadas con vocales (opcional)

  @Prop({ required: true })
  url: string; // URL del archivo de audio
}

// export type AudioDocument = HydratedDocument<Audio>;
export type AudioDocument = Audio & Document;
export const AudioSchema = SchemaFactory.createForClass(Audio);

AudioSchema.set('id', false);
AudioSchema.set('toJSON', { virtuals: true });
AudioSchema.set('toObject', { virtuals: true });
