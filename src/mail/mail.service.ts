// mail/mail.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { generateOTPEmailHTML } from './templates/otp';
import { AssetsService } from '../assets/assets.service';
import { join } from 'path';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly assetsService: AssetsService,
  ) {}

  async sendOTPEmail(email: string, otp: string): Promise<void> {
    try {
      this.logger.log(`Enviando OTP a: ${email}`);

      const currentYear = new Date().getFullYear();
      const logoUrl = this.assetsService.getLogoUrl();
      const htmlContent = generateOTPEmailHTML(otp, currentYear, logoUrl);

      await this.mailerService.sendMail({
        to: email,
        subject: 'Tu código de verificación - Perfumery',
        html: htmlContent,
      });

      this.logger.log(`OTP enviado exitosamente a: ${email}`);
    } catch (error) {
      this.logger.error(`Error enviando OTP a ${email}:`, error);
      throw error;
    }
  }
}
