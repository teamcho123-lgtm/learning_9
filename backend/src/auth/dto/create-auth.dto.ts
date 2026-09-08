import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateAuthDto {

    @IsNotEmpty({ message: "email khong dc bo trong" })
    email: string;

    @IsNotEmpty({ message: "password khong dc bo trong" })
    password: string;

    @IsOptional()
    name: string;
}