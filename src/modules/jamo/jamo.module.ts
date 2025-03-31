import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Jamo, JamoSchema } from './jamo.schema';
import { JamoRepository } from './jamo.repository';
import { JamoService } from './jamo.service';
import { JamoController } from './jamo.controller';
import { AuditModule } from '../audit/audit.module';
import { FileUploadService } from './fileUpload.service';
import { AudioRepository } from './audio.repository';
import { Audio, AudioSchema } from './audio.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Jamo.name, schema: JamoSchema }]),
    MongooseModule.forFeature([{ name: Audio.name, schema: AudioSchema }]),
    AuditModule,
  ],
  providers: [JamoRepository, AudioRepository, JamoService, FileUploadService],
  exports: [JamoRepository, JamoService],
  controllers: [JamoController],
})
export class JamoModule {}
