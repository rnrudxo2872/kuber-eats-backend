import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Verification } from './entities/verification.entity';
import { VerificationOption } from './verification.interface';
import { VerificationResolver } from './verification.resolver';
import { VerificationService } from './verification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Verification, User])],
})
export class VerificationModule {
  static forRoot(Options: VerificationOption): DynamicModule {
    return {
      global: Options?.isGlobal,
      module: VerificationModule,
      providers: [VerificationService, VerificationResolver],
      exports: [VerificationService],
    };
  }
}
