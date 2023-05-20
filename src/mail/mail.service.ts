import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { InjectModel } from "@nestjs/sequelize";
import { Mail } from "./mail.model";
import { CreateMailDto } from "./dto/create-mail.dto";
import { ConfigService } from "@nestjs/config";
import * as uuid from "uuid"

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

  async generateActivationLink(userId: number, email: string) {
    const activationLink = uuid.v4()
    const mailStatus = await this.create({activationLink, userId})
    await this.createActivationLink(email, `${this.configService.get<string>('API_URL')}/api/mail/activate/${activationLink}`)
    return mailStatus
  }

  async activate(activationLink) {
    const account = await this.mailProvider.findOne({where: {activationLink}})
    if(!account){
      throw new HttpException(`Uncorrect activation link`, HttpStatus.BAD_REQUEST)
    }
    account.isActivate = true
    await account.save()
  }

  async getAccountStatusByUserId(userId) {
    return await this.mailProvider.findOne({where: {userId}})
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
