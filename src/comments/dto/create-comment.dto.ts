import { IsNotEmpty } from "class-validator"
import { Movie } from "src/movies/entities/movie.entity";
import { Comment } from "../entities/comment.entity";
import { User } from "src/users/entities/user.entity";

export class CreateCommentDto {
  @IsNotEmpty({message: "content không được để trống",})
  content: string;

  @IsNotEmpty({message: "movie không được để trống",})
  movie: Movie

  // @IsNotEmpty({message: "movie không được để trống",})
  user: User

  parent_comment: Comment

  // reply_comments: ReplyComment[];

  // like_comments: LikeComment[];
}
