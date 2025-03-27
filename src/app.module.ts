import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION } from './config/database.config';
import { JamoModule } from './modules/jamo/jamo.module';

@Module({
  imports: [MongooseModule.forRoot(DATABASE_CONNECTION), JamoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
