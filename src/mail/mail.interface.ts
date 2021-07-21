import { IsBoolean, IsString } from 'class-validator';

export class MailOptions {
  @IsBoolean()
  isGlobal = false;

  @IsString()
  apiKey: string;

  @IsString()
  domain: string;

  @IsString()
  fromEmail: string;
}
