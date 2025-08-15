import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const port = parseInt(config.get<string>('EMAIL_PORT', '587'), 10);
        const secure = config.get<string>('EMAIL_SECURE', 'false') === 'true';

        return {
          transport: {
            host: 'smtp.gmail.com',
            port: port,
            secure: secure,
            auth: {
              user: config.get<string>('EMAIL_USER'),
              pass: config.get<string>('EMAIL_PASS'),
            },
          },
          defaults: {
            from: config.get<string>(
              'EMAIL_FROM',
              '"Perfumery" <noreply@perfumery.com>',
            ),
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
