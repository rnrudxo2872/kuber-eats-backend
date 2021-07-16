import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

type UserRole = 'client' | 'owner' | 'del';

@Entity()
export class User extends CoreEntity {
  @Column()
  @IsString()
  email: string;

  @Column()
  @IsString()
  password: string;

  @Column()
  role: UserRole;
}
