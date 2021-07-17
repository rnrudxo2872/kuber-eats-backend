import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { User } from '../entities/user.entity';

@InputType()
export class createAccountInput extends PickType(
  User,
  ['email', 'password', 'role'],
  InputType,
) {}

@ObjectType()
export class createAccountOutput {
  @Field((_) => String, { nullable: true })
  @IsString()
  @IsOptional()
  error?: string;

  @Field((_) => Boolean, { nullable: true })
  @IsBoolean()
  ok: boolean;
}
