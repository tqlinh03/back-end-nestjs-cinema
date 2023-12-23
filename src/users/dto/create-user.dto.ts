import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({message: "name không được để trống",})
    name: string;

    @IsEmail({}, {message: "Email không đúng định dạng",})
    @IsNotEmpty({message: "Email không được để trống",})
    email: string;

    @IsNotEmpty({message: "Password không được để trống",})
    password: string;

    @IsNotEmpty({message: "Gender không được để trống",})
    gender: string;

    @IsNotEmpty({message: "Assress không được để trống",})
    address: string;
}
