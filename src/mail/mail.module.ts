import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../user/user.model";
import { Mail } from "./mail.model";
import { MailController } from './mail.controller';
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import * as path from "path"
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([User, Mail]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get('SMTP_HOST'),
            port: configService.get("SMTP_PORT"),
            auth: {
              user: configService.get("MAIL_USERNAME"),
              pass: configService.get("MAIL_PASSWORD"),
            },
          },
          defaults: {
            from: '"No Reply" <noreply@example.com>',
          },
          template: {
            dir: path.join(__dirname, "..", 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        }
      },
      inject: [ConfigService],
    })
  ],
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService]
})
export class MailModule {}
