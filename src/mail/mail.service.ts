import { Inject, Injectable } from '@nestjs/common';
import { MAIL_CONFIG_OPTIONS } from './mail.constant';
import { MailOptions } from './mail.interface';
import * as formData from 'form-data';
import got from 'got';

@Injectable()
export class MailService {
  constructor(
    @Inject(MAIL_CONFIG_OPTIONS) private readonly options: MailOptions,
  ) {}

  private async sendEamil(subject: string, content: string) {
    const form = new formData();
    form.append('from', `Kuber-eats <mailgun@${this.options.domain}>`);
    form.append('to', this.options.fromEmail);
    form.append('subject', subject);
    form.append('html', `${content}`);

    const response = await got(
      `https://api.mailgun.net/v3/${this.options.domain}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `api:${this.options.apiKey}`,
          ).toString('base64')}`,
        },
        body: form,
      },
    );
    console.log(response.body);
  }

  sendVerifyEmail(username: string, code: string) {
    this.sendEamil(username, code);
  }
}
