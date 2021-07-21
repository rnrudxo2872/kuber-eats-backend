import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { Verification } from '../entities/verification.entity';

@InputType()
export class VerificationInput extends PickType(
  Verification,
  ['code'],
  InputType,
) {}

@ObjectType()
export class VerificationOutput extends CommonOutput {}
