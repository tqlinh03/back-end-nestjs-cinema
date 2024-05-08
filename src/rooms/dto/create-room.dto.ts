import { IsBoolean, IsNotEmpty } from "class-validator"

export class CreateRoomDto {
  @IsNotEmpty({message: "name không được để trống",})
  name: string

  @IsNotEmpty({message: "isActive không được để trống",})
  @IsBoolean({message: "isActive có giá trị là boolean",})
  isActive: boolean 
}
