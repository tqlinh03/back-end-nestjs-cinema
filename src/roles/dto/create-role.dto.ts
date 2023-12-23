import { IsNotEmpty } from "class-validator";

export class CreateRoleDto {
    @IsNotEmpty({message: "name không được để trống",})
    name: string;

    @IsNotEmpty({message: "description không được để trống",})
    description: string;
}
