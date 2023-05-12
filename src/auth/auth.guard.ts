import { Injectable, CanActivate, ExecutionContext, HttpException, UnauthorizedException } from "@nestjs/common";
import { Observable } from 'rxjs';
import { TokenService } from "../token/token.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest()

      const authorizationHeader = request.headers.authorization
      if(!authorizationHeader){
        throw new UnauthorizedException({message: `User invalid`})
      }

      const token = authorizationHeader.split(" ")[1]

      if(!token){
        throw new UnauthorizedException({message: `User are not authorized`})
      }

      const userData = this.tokenService.validateAccessToken(token)
      if(!userData){
        throw new UnauthorizedException({message: `User are not authorized`})
      }

      request.user = userData
      return true

    } catch (e) {
      throw new UnauthorizedException({message: `User are not authorized`})
    }
  }
}
