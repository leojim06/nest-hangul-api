import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JamoModule } from './modules/jamo/jamo.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
// import { AuditModule } from './modules/audith/audit.module';
// import { SecurityGateway } from './security/security.gateway';
// import { SecurityModule } from './security/security.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    AuthModule,
    JamoModule,
    UsersModule,
    // SecurityModule,
    // AuditModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // SecurityGateway
  ],
  // exports: [AuditModule],
})
export class AppModule {}
