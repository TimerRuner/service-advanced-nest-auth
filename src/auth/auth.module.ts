import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from "../user/user.module";
import { TokenModule } from "../token/token.module";
import { MailModule } from "../mail/mail.module";
import { ConfigModule } from "@nestjs/config";
import { GoogleStrategy } from "./strategies/google.strategy";

@Module({
  imports: [
    UserModule,
    TokenModule,
    MailModule,
    ConfigModule
  ],
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    AuthService
  ]
})
export class AuthModule {}
