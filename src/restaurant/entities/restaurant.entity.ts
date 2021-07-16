import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Restaurant {
  @Field((_) => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field((_) => String)
  @Column()
  @IsString()
  name: string;

  @Field((_) => Boolean, { nullable: true, defaultValue: false })
  @Column({ default: true })
  @IsOptional()
  @IsBoolean()
  isVegan?: boolean;

  @Field((_) => String)
  @Column()
  @IsString()
  address: string;
}
