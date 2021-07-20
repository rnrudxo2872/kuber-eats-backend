import { ArgsType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@ArgsType()
export class EditUserInput extends PartialType(
  PickType(User, ['email', 'password'], ArgsType),
) {}

@ObjectType()
export class EditUserOutput extends CommonOutput {}
