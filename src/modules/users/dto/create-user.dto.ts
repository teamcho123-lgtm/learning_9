import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty({ message: "Name khong duoc de trong" })
    name: string;

    @IsNotEmpty({ message: "Email khong duoc de trong" })
    @IsEmail({}, { message: "Email khong hop le" })
    email: string;

    @IsNotEmpty({ message: "Password khong duoc de trong" })
    password: string;


    @IsOptional()
    phone: string;

    @IsOptional()
    address: string;

    @IsOptional()
    image: string;
}
