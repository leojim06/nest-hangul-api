import { Module } from '@nestjs/common';
import { SecurityGateway } from './security.gateway';

@Module({
  providers: [SecurityGateway],
  exports: [SecurityGateway],
})
export class SecurityModule {}
