import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TryCatch } from 'src/common/decorators/tryCatch.decorator';
import { UsersService } from 'src/users/users.service';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  @TryCatch('유저의 정보를 얻을 수 없습니다.')
  async use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'].toString();
      const decode = this.jwtService.verify(token);

      if (typeof decode === 'object' && decode.hasOwnProperty('id')) {
        const user = await this.userService.getById(decode.id);
        console.log(user);
        req['users'] = user;
      }
    }
    next();
  }
}
