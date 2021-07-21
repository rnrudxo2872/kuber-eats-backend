import { IsBoolean, IsOptional } from 'class-validator';

export class VerificationOption {
  @IsOptional()
  @IsBoolean()
  isGlobal: boolean;
}
