import { Role } from 'src/roles/entities/role.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  address: string;

  @Column()
  gender: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Column({ type: 'json', nullable: true })
  createdBy: {
    _id: number;
    email: string;
  };

  @Column({ type: 'json', nullable: true })
  updatedBy: {
    _id: number;
    email: string;
  }

  @Column({ type: 'json', nullable: true })
  deleteBy: {
    _id: number;
    email: string;
  }

  @OneToMany(() => Role, (role) => role.user)
  roles: Role[]

}
