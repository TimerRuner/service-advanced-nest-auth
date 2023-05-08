import { BadRequestException, Controller, Get } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get("all")
  async getAllUsers() {
    try {
      return await this.userService.getAllUsers()
    } catch (e) {
      throw new BadRequestException(`${e.message}`)
    }
  }
}
