import { ArgsType, Field } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';

@ArgsType()
export class CreateRestaurantDTO {
  @Field((_) => String)
  @IsString()
  @Length(5, 10)
  name: string;

  @Field((_) => Boolean)
  @IsBoolean()
  isVegan: boolean;

  @Field((_) => String) waaws;
  @IsString()
  address: string;

  @Field((_) => String)
  @IsString()
  @Length(5, 10)
  ownerName: string;
}
