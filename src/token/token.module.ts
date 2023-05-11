import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../user/user.model";
import { Token } from "./token.model";
import { TokenController } from './token.controller';
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([User, Token]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get("JWT_SECRET")
      }),
      inject: [ConfigService]
    })
  ],
  providers: [TokenService],
  controllers: [TokenController],
  exports: [TokenService]
})
export class TokenModule {}
