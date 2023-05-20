import { Body, Controller, Get, Post, Req, Res, UseGuards, UsePipes } from "@nestjs/common";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { Response, Request } from "express";
import { TokenService } from "../token/token.service";
import { CustomValidationPipe } from "../pipes/validatoin.pipe";
import { AuthGuard } from "@nestjs/passport";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}
  @UsePipes(CustomValidationPipe)
  @Post("login")
  async login(@Body() dto: CreateUserDto, @Res() res: Response){
    const userData =  await this.authService.login(dto)
    res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 60 * 1000, httpOnly: true })
    return res.json(userData)
  }

  @UsePipes(CustomValidationPipe)
  @Post("registration")
  async registration(@Body() dto: CreateUserDto, @Res() res: Response){
    const registrationData =  await this.authService.registration(dto)
    res.cookie('refreshToken', registrationData.refreshToken, {maxAge: 30 * 60 * 1000, httpOnly: true });
    return res.json(registrationData)
  }

  @Post("logout")
  async logout(@Req() req: Request, @Res() res: Response){
    const refreshToken = req.cookies['refreshToken'];
    await this.authService.logout(refreshToken)
    res.clearCookie('refreshToken', { httpOnly: true });
    return res.json({})
  }

  @Get("refresh")
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    const userData = await this.authService.refresh(refreshToken)
    res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 60 * 1000, httpOnly: true })
    return res.json(userData)
  }

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleLogin() {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleCallback(@Req() req, @Res() res) {
    const {user} = req
    res.cookie('refreshToken', user.refreshToken, {maxAge: 30 * 60 * 1000, httpOnly: true })
    return res.json(user)
  }
}
