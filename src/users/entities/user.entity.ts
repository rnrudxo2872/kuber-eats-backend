import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

type UserRole = 'client' | 'owner' | 'del';

@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @IsString()
  @Field((_) => String)
  email: string;

  @Column()
  @IsString()
  @Field((_) => String)
  password: string;

  @Column()
  @Field((_) => String)
  role: UserRole;
}
