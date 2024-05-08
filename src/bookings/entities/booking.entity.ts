import { Movie } from 'src/movies/entities/movie.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  ma_GD: string;

  @Column("simple-array")
  seats: string[];

  @Column()
  total_price: number;

  @Column({ default: false })
  isPayment: boolean;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @ManyToOne(() => User, (movie) => movie.bookings)
  user: User

  @ManyToOne(() => Movie, (movie) => movie.bookings)
  movie: Movie

  // @OneToMany(() => Seat,(seat) => seat.booking)
  // seats: Seat[]
}
