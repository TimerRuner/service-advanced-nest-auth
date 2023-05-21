import { Controller, Get, Param, Res } from "@nestjs/common";
import { MailService } from "./mail.service";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService, private readonly configService: ConfigService) {}
  @Get("activate/:link")
  async activate(@Param("link") activationLink: string, @Res() res: Response){
    await this.mailService.activate(activationLink)
    return res.redirect(this.configService.get("UI_URL"))
  }
}
