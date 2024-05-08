import { IsDate, IsNotEmpty } from "class-validator"
import { Movie } from "src/movies/entities/movie.entity"

export class CreateShowtimeDto {
  @IsNotEmpty({message: "date không được để trống",})
  @IsDate()
  date: Date

  @IsNotEmpty({message: "start_time không được để trống",})
  @IsDate()
  start_time: Date

  @IsNotEmpty({message: "end_time không được để trống",})
  @IsDate()
  end_time: Date

  @IsNotEmpty({message: "movie không được để trống",})
  movie: Movie
}
