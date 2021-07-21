import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import * as crypto from 'crypto';

@ObjectType()
@Entity()
export class Verification extends CoreEntity {
  @Column()
  @Field((_) => String)
  @IsString()
  code: string;

  @OneToOne((_) => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Field((_) => User)
  user: User;

  @BeforeInsert()
  @BeforeUpdate()
  createCode() {
    const code = `${this.user.id}$${crypto.randomBytes(5).toString('hex')}`;
    this.code = code;
  }
}
