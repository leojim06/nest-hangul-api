import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Audit, AuditSchema } from './audit.schema';
import { AuditService } from './audit.service';
// import { SecurityModule } from 'src/security/security.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Audit.name, schema: AuditSchema }]),
    // SecurityModule,
  ],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
