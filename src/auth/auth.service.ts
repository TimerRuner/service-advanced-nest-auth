import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";

import * as bcrypt from "bcryptjs"
import * as uuid from "uuid"
import * as path from "path"

import { UserService } from "../user/user.service";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { TokenService } from "../token/token.service";
import { MailService } from "../mail/mail.service";
import { ConfigService } from "@nestjs/config";
import { filterPrivateFields } from "./dto-filter/user-filter-dto";
import { IAuthResponse } from "./interfaces/auth.interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService
  ) {}

  async generateTokens(user): Promise<IAuthResponse>{
    const accountStatus = await this.mailService.getAccountStatusByUserId(user.id)

    const userPreparation = filterPrivateFields({...user, isActivate: accountStatus.isActivate}, ["password"])
    const {refreshToken, accessToken} = this.tokenService.generateToken(userPreparation)

    await this.tokenService.saveToken(user.id, refreshToken)

    return {
      ...user.dataValues,
      refreshToken,
      accessToken,
      isActivate: accountStatus.isActivate
    }
  }

  async login(dto: CreateUserDto): Promise<IAuthResponse>{
    const user = await this.userService.getUserByEmail(dto.email)
    if(!user){
      throw new HttpException(`User ${dto.email} doesn't exist`, HttpStatus.BAD_REQUEST)
    }

    const validPassword = await bcrypt.compare(dto.password, user.password)
    if(!validPassword){
      throw new HttpException(`Unvalid password for user ${dto.email}`, HttpStatus.BAD_REQUEST)
    }

    return await this.generateTokens(user)
  }

  async registration(dto: CreateUserDto) {
    const potentialUser = await this.userService.getUserByEmail(dto.email)
    if(potentialUser){
      throw new HttpException(`User with email ${dto.email} - already exist`, HttpStatus.BAD_REQUEST)
    }
    const hasPassword = await bcrypt.hash(dto.password, 5)
    const activationLink = uuid.v4()

    const user = await this.userService.create({email: dto.email, password: hasPassword})
    const mailStatus = await this.mailService.create({activationLink, userId: user.id})
    await this.mailService.createActivationLink(dto.email, `${this.configService.get<string>('API_URL')}/api/mail/activate/${activationLink}`)

    const userPreparation = filterPrivateFields({...user, isActivate: mailStatus.isActivate}, ["password"])
    const {refreshToken, accessToken} = this.tokenService.generateToken(userPreparation)
    const savedTokenRecord = await this.tokenService.saveToken(user.id, refreshToken)

    user.tokenId = savedTokenRecord.id
    user.mailId = mailStatus.id
    await user.save()

    return {
      ...user.dataValues,
      refreshToken,
      accessToken,
      isActivate: mailStatus.isActivate
    }
  }

  async logout(refreshToken) {
    return await this.tokenService.deleteToken(refreshToken)
  }

  async refresh(token){
    if(!token) {
      throw new HttpException(`User unauthorized`, HttpStatus.UNAUTHORIZED)
    }
    const validToken = await this.tokenService.validateRefreshToken(token)
    const userTokenData = await this.tokenService.findToken(token)
    if(!validToken && !userTokenData){
      throw new HttpException(`User unauthorized`, HttpStatus.UNAUTHORIZED)
    }

    const user = await this.userService.getUserById(userTokenData.userId)

    return await this.generateTokens(user)
  }

}
