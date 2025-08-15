// mail/mail.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendOTPEmail(email: string, otp: string): Promise<void> {
    try {
      this.logger.log(`Enviando OTP a: ${email}`);
      
      await this.mailerService.sendMail({
        to: email,
        subject: '🌸 Tu código de verificación - Perfumery',
        template: 'otp',
        context: { 
          otp,
          currentYear: new Date().getFullYear(),
        },
      });
      
      this.logger.log(`OTP enviado exitosamente a: ${email}`);
    } catch (error) {
      this.logger.error(`Error enviando OTP a ${email}:`, error);
      throw error;
    }
  }
}
