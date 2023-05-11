import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { Response, Request } from "express";
import { TokenService } from "../token/token.service";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}
  @Post("login")
  async login(@Body() dto: CreateUserDto, @Res() res: Response){
    const userData =  await this.authService.login(dto)
    res.cookie('refreshToken', userData.refreshToken, {maxAge: 30000, httpOnly: true })
    return res.json(userData)
  }

  @Post("registration")
  async registration(@Body() dto: CreateUserDto, @Res() res: Response){
    const registrationData =  await this.authService.registration(dto)
    res.cookie('refreshToken', registrationData.refreshToken, {maxAge: 30000, httpOnly: true });
    return res.json(registrationData)
  }

  @Post("logout")
  async logout(@Res() req: Request, @Res() res: Response){
    const refreshToken = req.cookies['refreshToken'];
    await this.authService.logout(refreshToken)
    res.clearCookie('token', { httpOnly: true });
  }

  @Get("refresh")
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    const userData = await this.authService.refresh(refreshToken)
    res.cookie('refreshToken', userData.refreshToken, {maxAge: 30000, httpOnly: true })
    return res.json(userData)
  }
}
