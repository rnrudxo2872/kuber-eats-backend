import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MAIL_CONFIG_OPTIONS } from './mail.constant';
import { MailContext, MailOptions } from './mail.interface';

@Injectable()
export class MailService {
  constructor(
    @Inject(MAIL_CONFIG_OPTIONS) private readonly options: MailOptions,
    private readonly mailerService: MailerService,
    private readonly confingService: ConfigService,
  ) {
    this.sendVerifyEmail('rnrudxo@gmail.com', 'ei14l5m23eee');
  }

  private async sendEamil(mailContext: MailContext) {
    return this.mailerService.sendMail({
      from: this.confingService.get('MAIL_FROM_EMAIL'),
      ...mailContext,
    });
  }

  async sendVerifyEmail(username: string, code: string) {
    await this.sendEamil({
      subject: 'Kuber Eats Email Verify',
      to: username,
      html: `<h1>Please Verify Your Email</h1><div>Hello, ${username}!</div><a href="http://127.0.0.1:3000?confirm=${code}"><button>Verify Email</button></a><div>Thanks for choosing Kuber Eats. </div>`,
    });
    console.log('보내졌나?');
  }
}
