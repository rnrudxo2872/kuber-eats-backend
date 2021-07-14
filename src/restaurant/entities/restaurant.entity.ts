import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Restaurant {
  @Field((_) => String)
  name: string;

  @Field((_) => Boolean, { nullable: true })
  isGood?: boolean;
}
