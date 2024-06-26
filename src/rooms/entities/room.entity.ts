import { Cinema } from 'src/cinemas/entities/cinema.entity';
import { Showtime } from 'src/showtimes/entities/showtime.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  name: string;

  @Column({default: true})
  isActive: boolean;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;


  @ManyToOne(() => Cinema, (cinema) => cinema.rooms)
  cinema: Cinema


  
  @ManyToOne(() => Showtime, (showtime) => showtime.rooms)
  showtime: Showtime
}
