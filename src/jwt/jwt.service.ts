import { Inject, Injectable } from '@nestjs/common';
import { JwtModuleOptions } from './jwt.interface';

@Injectable()
export class JwtService {
  constructor(@Inject('config') private readonly options: JwtModuleOptions) {}
  hello() {
    console.log('hello');
  }
}
