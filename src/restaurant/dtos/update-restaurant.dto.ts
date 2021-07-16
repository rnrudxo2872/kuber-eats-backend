import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { CreateRestaurantDTO } from './create-restaurant.dto';

@InputType()
class updateRestaurantBaseDTO extends PartialType(CreateRestaurantDTO) {}

@InputType()
export class updateRestaurantDTO {
  @Field((_) => Number)
  @IsNumber()
  id: number;

  @Field((_) => updateRestaurantBaseDTO)
  data: updateRestaurantBaseDTO;
}
