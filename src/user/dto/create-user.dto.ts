import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {
  @IsString({message: "Повинно бути строкою"})
  @IsEmail({}, {message: "Некоректний email"})
  readonly email: string
  @IsString({message: "Повинно бути строкою"})
  @Length(4, 16, {message: "Довжина паролю повинна бути від 4 до 16 символів"})
  readonly password: string
}