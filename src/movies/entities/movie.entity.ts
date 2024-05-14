
import { Booking } from 'src/bookings/entities/booking.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Showtime } from 'src/showtimes/entities/showtime.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  genre: string;

  @Column()
  time: number;

  @Column()
  director: string;

  @Column()
  cast: string;

  @Column()
  ReleaseDate: Date;

  @Column()
  videoURL: string;

  @Column()
  img: string;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @OneToMany(() => Showtime, (showtime) => showtime.movie)
  showtimes: Showtime[]

  @OneToMany(() => Booking, (booking) => booking.movie)
  bookings: Booking[]

  @OneToMany(() => Comment, (comment) => comment.movie)
  comments: Comment[]
} 
