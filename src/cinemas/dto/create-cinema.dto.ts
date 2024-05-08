import { IsNotEmpty } from "class-validator"

export class CreateCinemaDto {
  @IsNotEmpty({message: "name không được để trống",})
  name: string

  @IsNotEmpty({message: "area không được để trống",})
  area: string
}
