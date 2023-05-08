import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../user/user.model";
import { Mail } from "./mail.model";
import { MailController } from './mail.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Mail])
  ],
  providers: [MailService],
  controllers: [MailController]
})
export class MailModule {}
