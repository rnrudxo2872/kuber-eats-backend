import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { VerificationInput, VerificationOutput } from './dtos/verification.dto';
import { Verification } from './entities/verification.entity';
import { VerificationService } from './verification.service';

@Resolver((_) => Verification)
export class VerificationResolver {
  constructor(private readonly verificationService: VerificationService) {}

  @Mutation((_) => VerificationOutput)
  async verifyEmail(
    @Args('input') verificationInput: VerificationInput,
  ): Promise<VerificationOutput> {
    return this.verificationService.verifyEmail(verificationInput);
  }
}
