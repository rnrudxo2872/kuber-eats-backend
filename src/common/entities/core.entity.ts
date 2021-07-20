import { Field, ObjectType } from '@nestjs/graphql';
import { IsDate, IsNumber } from 'class-validator';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class CoreEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  @Field((_) => Number)
  id: number;

  @CreateDateColumn()
  @IsDate()
  @Field((_) => Date)
  createAt: Date;

  @UpdateDateColumn()
  @IsDate()
  @Field((_) => Date)
  updateAt: Date;
}
