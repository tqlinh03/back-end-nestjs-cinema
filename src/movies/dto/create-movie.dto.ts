import { IsNotEmpty, IsNumber } from "class-validator"

export class CreateMovieDto {
  @IsNotEmpty({message: "name không được để trống",})
  name: string
  
  @IsNotEmpty({message: "description không được để trống",})
  description: string
  
  @IsNotEmpty({message: "genre không được để trống",})
  genre: string
  
  @IsNotEmpty({message: "time không được để trống",})
  @IsNumber()
  time: number
  
  @IsNotEmpty({message: "director không được để trống",})
  director: string
  
  @IsNotEmpty({message: "cast không được để trống",})
  cast: string
  
  @IsNotEmpty({message: "ReleaseDate không được để trống",})
  ReleaseDate: string
  
  @IsNotEmpty({message: "videoURL không được để trống",})
  videoURL: string
  
  @IsNotEmpty({message: "img không được để trống",})
  img: string
}
