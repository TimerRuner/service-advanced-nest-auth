import { Injectable } from '@nestjs/common';
import { MailerService } from "@nestjs-modules/mailer";
import { InjectModel } from "@nestjs/sequelize";
import { Mail } from "./mail.model";
import { CreateMailDto } from "./dto/create-mail.dto";
import * as process from "process";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectModel(Mail) private readonly mailProvider: typeof Mail,
    private readonly configService: ConfigService
  ) {}

  async create(dto: CreateMailDto){
    return await this.mailProvider.create(dto)
  }
  async createActivationLink(email: string, link: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: `Activation account ${this.configService.get<string>('API_URL')}`,
      template: 'welcome',
      context: {
        link,
        email
      },
    });
  }
}
