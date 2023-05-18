import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/sequelize";
import { Token } from "./token.model";

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(Token) private readonly tokenProvider: typeof Token,
  ) {}

  generateToken(payload){
    const accessToken = this.jwtService.sign(payload,  {expiresIn: '15m'})
    const refreshToken = this.jwtService.sign(payload, {expiresIn: '30m'})
    return {
      accessToken,
      refreshToken
    }
  }

  validateAccessToken(token) {
    try {
      return this.jwtService.verify(token)
    } catch (e) {
      return null
    }
  }

  validateRefreshToken(token) {
    try {
      return this.jwtService.verify(token)
    } catch (e) {
      return null
    }
  }

  async saveToken(userId, refreshToken) {
    try {
      const tokenData = await this.tokenProvider.findOne({where: {userId}})
      if(tokenData){
        tokenData.refreshToken = refreshToken
        tokenData.save()
        return tokenData
      } else {
        return await this.tokenProvider.create({userId, refreshToken})
      }
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }

  async deleteToken(refreshToken) {
    await this.tokenProvider.destroy({ where: { refreshToken } })
  }

  async findToken(refreshToken) {
    return await this.tokenProvider.findOne({where: {refreshToken}})
  }
}
