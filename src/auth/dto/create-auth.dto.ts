import { IsNotEmpty } from "class-validator";

export class CreateAuthDto {

    @IsNotEmpty({ message: "username khong dc bo trong" })
    username: string;

    @IsNotEmpty({ message: "password khong dc bo trong" })
    password: string;
}
