import { Permission } from 'src/permissions/entities/permission.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
@Unique(['name'])
export class Role {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({default: true})
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
  };

  @Column({ type: 'json', nullable: true })
  deleteBy: {
    _id: number;
    email: string;
  };

  @OneToMany(() => User, user => user.role) // Mối quan hệ 1-N với UserEntity
  users: User[];

  @ManyToMany(() => Permission, {
    cascade: true,
})
  @JoinTable()
  permissions: Permission[];
}
