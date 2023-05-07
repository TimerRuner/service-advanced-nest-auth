import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../user/user.model";
import { Mail } from "./mail.model";

@Module({
  imports: [
    SequelizeModule.forFeature([User, Mail])
  ],
  providers: [MailService]
})
export class MailModule {}
