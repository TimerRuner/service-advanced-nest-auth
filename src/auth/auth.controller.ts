import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("login")
  async login(@Body() dto: CreateUserDto){}

  @Post("registration")
  async registration(@Body() dto: CreateUserDto){
    try {
      return await this.authService.registration(dto)
    } catch (e) {
      console.log(e)
    }
  }

  @Post("logout")
  async logout(){}
}
