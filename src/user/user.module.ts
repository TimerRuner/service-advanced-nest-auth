import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./user.model";
import { Token } from "../token/token.model";
import { Mail } from "../mail/mail.model";
import { TokenModule } from "../token/token.module";

@Module({
  imports: [
    TokenModule,
    SequelizeModule.forFeature([User, Token, Mail])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
