import { Controller, Param, Post } from "@nestjs/common";

@Controller('mail')
export class MailController {
  @Post("activate/:link")
  async activate(@Param("link") activationLink: string){}
}
