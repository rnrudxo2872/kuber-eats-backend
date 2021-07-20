import { InternalServerErrorException } from '@nestjs/common';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';

enum UserRole {
  Client,
  Owner,
  Delivery,
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User Info Object',
});

@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @IsEmail()
  @Field((_) => String)
  email: string;

  @Column({ select: false })
  @IsString()
  @Field((_) => String)
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  @Field((_) => UserRole)
  role: UserRole;

  @BeforeInsert()
  @BeforeUpdate()
  async beforInsertDB() {
    if (!this.password) {
      return;
    }
    try {
      this.password = await bcrypt.hash(this.password, 5);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(passowrdA: string): Promise<boolean> {
    try {
      console.log(this.password);

      return bcrypt.compare(passowrdA, this.password);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
