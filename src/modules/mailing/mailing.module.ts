import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailingService } from './mailing.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const transport = {
          host: 'smtp.yandex.ru',
          port: 465,
          secure: true,
          auth: {
            user: configService.get('emailConfig.email'),
            pass: configService.get('emailConfig.emailPw'),
          },
        };

        return {
          transport,
          defaults: {
            from: `"EndToend Support" <${configService.get(
              'emailConfig.email',
            )}>`,
          },
          template: {
            dir: process.cwd() + '/templates',
            adapter: new EjsAdapter(),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailingService],
  exports: [MailingService],
})
export class MailingModule {}
