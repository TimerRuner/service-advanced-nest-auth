import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "../user/dto/create-user.dto";

@Controller('auth')
export class AuthController {
  @Post("login")
  async login(@Body() dto: CreateUserDto){}

  @Post("registration")
  async registration(@Body() dto: CreateUserDto){}

  @Post("logout")
  async logout(){}
}
