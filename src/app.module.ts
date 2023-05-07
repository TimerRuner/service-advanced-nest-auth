import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {SequelizeModule} from "@nestjs/sequelize";
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { MailModule } from './mail/mail.module';
import { UserModule } from './user/user.module';
import { User } from "./user/user.model";
import { Mail } from "./mail/mail.model";
import { Token } from "./token/token.model";

@Module({
  imports: [
      ConfigModule.forRoot({
        envFilePath: ".env"
      }),
      SequelizeModule.forRoot({
          dialect: "postgres",
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          models: [User, Mail, Token],
          autoLoadModels: true
      }),
      AuthModule,
      TokenModule,
      MailModule,
      UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
