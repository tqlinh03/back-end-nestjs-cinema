
import { Movie } from 'src/movies/entities/movie.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
@Tree("materialized-path")
export class Comment {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  content: string;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @TreeParent()
  parent_comment: Comment;

  @TreeChildren()
  replies: Comment[]


  @ManyToOne(() => Movie, (movie) => movie.comments)
  movie: Movie

  @ManyToOne(() => User, (user) => user.comments)
  user: User
}
