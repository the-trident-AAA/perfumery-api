// mail/mail.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { generateOTPEmailHTML } from './templates/otp';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendOTPEmail(email: string, otp: string): Promise<void> {
    try {
      this.logger.log(`Enviando OTP a: ${email}`);

      const currentYear = new Date().getFullYear();
      const htmlContent = generateOTPEmailHTML(otp, currentYear);

      await this.mailerService.sendMail({
        to: email,
        subject: '🌸 Tu código de verificación - Perfumery',
        html: htmlContent,
      });

      this.logger.log(`OTP enviado exitosamente a: ${email}`);
    } catch (error) {
      this.logger.error(`Error enviando OTP a ${email}:`, error);
      throw error;
    }
  }
}
