import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { DynamicModule, Module } from '@nestjs/common';
import { MAIL_CONFIG_OPTIONS } from './mail.constant';
import { MailOptions } from './mail.interface';
import { MailService } from './mail.service';

@Module({})
export class MailModule {
  static forRoot(options: MailOptions): DynamicModule {
    return {
      global: options.isGlobal,
      module: MailModule,
      providers: [
        {
          provide: MAIL_CONFIG_OPTIONS,
          useValue: options,
        },
        MailService,
      ],
      exports: [MailService],
      imports: [
        MailerModule.forRoot({
          transport: {
            service: 'Naver',
            host: 'smtp.naver.com',
            port: 587,
            auth: {
              user: process.env.MAIL_FROM_EMAIL,
              pass: process.env.MAIL_FROM_PASS,
            },
          },
          template: {
            dir: process.cwd(),
            adapter: new PugAdapter(),
            options: {
              strict: true,
            },
          },
        }),
      ],
    };
  }
}
