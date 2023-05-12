import { Controller, Get, UseGuards, UsePipes } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "../auth/auth.guard";
import { CustomValidationPipe } from "../pipes/validatoin.pipe";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AuthGuard)
  @Get("all")
  async getAllUsers() {
    return await this.userService.getAllUsers()
  }
}
