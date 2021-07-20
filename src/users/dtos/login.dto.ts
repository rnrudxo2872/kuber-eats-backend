import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class LoginInput extends PickType(
  User,
  ['email', 'password'],
  InputType,
) {}

@ObjectType()
export class LoginOutput extends CommonOutput {
  @Field((_) => String, { nullable: true })
  @IsString()
  @IsOptional()
  token?: string;
}
