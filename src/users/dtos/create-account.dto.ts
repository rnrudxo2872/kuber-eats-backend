import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class createAccountInput extends PickType(
  User,
  ['email', 'password', 'role'],
  InputType,
) {}

@ObjectType()
export class createAccountOutput extends CommonOutput {}
