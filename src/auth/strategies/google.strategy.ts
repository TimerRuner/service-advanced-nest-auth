import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { AuthService } from "../auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: "388709238959-3aot1ea558voloa9m0t8mh18gjc3gg1b.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:4000/api/auth/google/callback",
      scope: ["profile", "email"]
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    const {emails} = profile
    const email = emails[0].value

    try {
      const user = await this.authService.validateUser(email)
      done(null, user)
    } catch (e) {
      done(new UnauthorizedException(), null)
    }
  }
}