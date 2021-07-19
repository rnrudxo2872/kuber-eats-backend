import { Inject, Injectable } from '@nestjs/common';
import { JWT_CONFIG_OPTIONS } from './jwt.constant';
import { JwtModuleOptions } from './jwt.interface';

@Injectable()
export class JwtService {
  constructor(
    @Inject(JWT_CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {}
  hello() {
    console.log('hello');
  }
}
