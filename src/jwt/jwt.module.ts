import { DynamicModule, Module } from '@nestjs/common';
import { JWT_CONFIG_OPTIONS } from './jwt.constant';
import { JwtModuleOptions } from './jwt.interface';
import { JwtService } from './jwt.service';

@Module({})
export class JwtModule {
  static forRoot(options?: JwtModuleOptions): DynamicModule {
    return {
      global: options?.isGlobal,
      module: JwtModule,
      providers: [
        {
          provide: JWT_CONFIG_OPTIONS,
          useValue: options,
        },
        JwtService,
      ],
      exports: [JwtService],
    };
  }
}
