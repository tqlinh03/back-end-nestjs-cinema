import { IsNotEmpty, IsNumber } from "class-validator";
import { Movie } from "src/movies/entities/movie.entity";
import { User } from "src/users/entities/user.entity";

export class CreateBookingDto {
  @IsNotEmpty({message: "total_price không được để trống",})
  @IsNumber()
  total_price: number;

  @IsNotEmpty({message: "seats không được để trống",})
  seats: string[];

  @IsNotEmpty({message: "movie không được để trống",})
  movie: Movie

  @IsNotEmpty({message: "user không được để trống",})
  user: User
}
