import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Restaurant {
  @Field((_) => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field((_) => String)
  @Column()
  name: string;

  @Field((_) => Boolean, { nullable: true })
  @Column()
  isVegan?: boolean;

  @Field((_) => String)
  @Column()
  address: string;

  @Field((_) => String)
  @Column()
  ownerName: string;

  @Field((_) => String)
  @Column()
  categoryName: string;
}
