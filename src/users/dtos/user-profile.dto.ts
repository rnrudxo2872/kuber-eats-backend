import { ArgsType, Field, ObjectType, PartialType } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@ArgsType()
export class UserProfileInput {
  @Field((_) => Number)
  @IsNumber()
  id: number;
}

@ObjectType()
export class UserProfileOutput extends CommonOutput {
  @Field((_) => User, { nullable: true })
  @IsOptional()
  user?: User;
}
