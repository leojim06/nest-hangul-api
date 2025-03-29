import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Audit, AuditDocument } from './audit.schema';
import { Model } from 'mongoose';
import { SecurityGateway } from '../security/security.gateway';

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(Audit.name) private auditModel: Model<AuditDocument>,
    private securityGateway: SecurityGateway,
  ) {}

  async logAction(
    userId: string,
    action: string,
    endpoint: string,
    ip: string,
  ) {
    await this.auditModel.create({ userId, action, endpoint, ip });

    if (action === 'FAILED_LOGIN') {
      this.securityGateway.sendSecurityAlert(
        `⚠️ Alerta: Intento fallido de login para el usuario ${userId} desde IP: ${ip}`,
      );
    }
  }
}
