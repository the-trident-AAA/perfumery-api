import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OtpService } from './otp.service';

@Injectable()
export class OtpSchedulerService {
  private readonly logger = new Logger(OtpSchedulerService.name);

  constructor(private readonly otpService: OtpService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpiredOTPs() {
    try {
      this.logger.log('Iniciando limpieza de OTPs expirados...');
      await this.otpService.cleanupExpiredOTPs();
      this.logger.log('Limpieza de OTPs expirados completada');
    } catch (error) {
      this.logger.error('Error al limpiar OTPs expirados:', error);
    }
  }
}
