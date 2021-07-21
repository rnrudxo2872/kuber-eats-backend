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
    };
  }
}
