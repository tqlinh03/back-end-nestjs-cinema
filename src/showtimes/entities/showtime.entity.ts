
import { Movie } from 'src/movies/entities/movie.entity';
import { Room } from 'src/rooms/entities/room.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class Showtime {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  date: Date;

  @Column()
  start_time: Date;

  @Column()
  end_time: Date;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @OneToMany(() => Room, room => room.showtime)
  rooms: Room[]

  @ManyToOne(() => Movie, (movie) => movie.showtimes)
  movie: Movie

}
