import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module, Global, forwardRef } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get("SMTP_HOST"),
          secure: true,
          auth: {
            user: config.get("SMTP_USR"),
            pass: config.get("SMTP_PW"),
          },
        },
        defaults: {
          from: '"Admin" <goaltrackeradm@gmail.com>',
          subject: "Welcome to Goal Tracker! Confirm Your Account Now!"
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(), 
          options: {
            strict: true,
          },
        }
      }), 
      inject: [ConfigService] 
    }),
    forwardRef(() => UserModule)
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}