import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

@ObjectType()
export class CommonOutput {
  @Field((_) => String, { nullable: true })
  @IsString()
  @IsOptional()
  error?: string;

  @Field((_) => Boolean)
  @IsBoolean()
  ok: boolean;
}
