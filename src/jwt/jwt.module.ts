import { DynamicModule, Module } from '@nestjs/common';
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
          provide: 'config',
          useValue: options,
        },
        JwtService,
      ],
      exports: [JwtService],
    };
  }
}
