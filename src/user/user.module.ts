import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./user.model";
import { Token } from "../token/token.model";
import { Mail } from "../mail/mail.model";

@Module({
  imports: [
    SequelizeModule.forFeature([User, Token, Mail])
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
