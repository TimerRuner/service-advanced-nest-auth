import { Controller, Post } from "@nestjs/common";

@Controller('token')
export class TokenController {
  @Post("refresh")
  async refresh() {}
}
