import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Jamo, JamoSchema } from './jamo.schema';
import { JamoRepository } from './jamo.repository';
import { JamoService } from './jamo.service';
import { JamoController } from './jamo.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Jamo.name, schema: JamoSchema }]),
  ],
  providers: [JamoRepository, JamoService],
  exports: [JamoRepository, JamoService],
  controllers: [JamoController],
})
export class JamoModule {}
