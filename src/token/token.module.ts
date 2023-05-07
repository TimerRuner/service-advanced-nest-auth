import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../user/user.model";
import { Token } from "./token.model";

@Module({
  imports: [
    SequelizeModule.forFeature([User, Token])
  ],
  providers: [TokenService]
})
export class TokenModule {}