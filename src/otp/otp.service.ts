// otp/otp.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as otplib from 'otplib';
import { DatabaseService } from 'src/database/database.service';
import { OtpEntity } from './entities/otp.entity';

@Injectable()
export class OtpService {
  constructor(
    private readonly db: DatabaseService,
    private readonly configService: ConfigService,
  ) {}

  generateOTP(): string {
    return otplib.authenticator.generate(
      this.configService.get<string>('OTP_SECRET'),
    );
  }

  async saveOTP(userId: string, otp: string): Promise<OtpEntity> {
    // Invalidar OTPs anteriores para este email
    await this.db.otpRepository.update(
      { userId, isUsed: false },
      { isUsed: true },
    );

    // Crear nuevo OTP
    const otpEntity = this.db.otpRepository.create({
      userId,
      otp,
      expiresAt: this.getOTPExpiration(),
    });

    return await this.db.otpRepository.save(otpEntity);
  }

  async verifyOTP(userId: string, token: string): Promise<boolean> {
    const otpEntity = await this.db.otpRepository.findOne({
      where: {
        userId,
        otp: token,
        isUsed: false,
      },
    });

    if (!otpEntity) {
      return false;
    }

    // Verificar si el OTP ha expirado
    if (new Date() > otpEntity.expiresAt) {
      // Marcar como usado si ha expirado
      await this.db.otpRepository.update(
        { id: otpEntity.id },
        { isUsed: true },
      );
      return false;
    }

    // Marcar como usado si es válido
    await this.db.otpRepository.update({ id: otpEntity.id }, { isUsed: true });

    return true;
  }

  getOTPExpiration(): Date {
    const expiresInMinutes = 5;
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + expiresInMinutes);
    return expiration;
  }

  async cleanupExpiredOTPs(): Promise<void> {
    const expiredDate = new Date();
    await this.db.otpRepository.delete({
      expiresAt: expiredDate,
    });
  }
}
