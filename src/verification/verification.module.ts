import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Verification } from './entities/verification.entity';
import { VerificationOption } from './verification.interface';
import { VerificationService } from './verification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Verification])],
})
export class VerificationModule {
  static forRoot(Options: VerificationOption): DynamicModule {
    return {
      global: Options.isGlobal,
      module: VerificationModule,
      providers: [VerificationService],
      exports: [VerificationService],
    };
  }
}
