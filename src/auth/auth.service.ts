import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import * as bcrypt from "bcryptjs"

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
      user: {
        id: user.dataValues.id,
        email: user.dataValues.email,
        isActivate: accountStatus.isActivate
      },
      refreshToken,
      accessToken,
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

  async registration(dto: CreateUserDto): Promise<IAuthResponse> {
    const potentialUser = await this.userService.getUserByEmail(dto.email)
    if(potentialUser){
      throw new HttpException(`User with email ${dto.email} - already exist`, HttpStatus.BAD_REQUEST)
    }
    const hasPassword = await bcrypt.hash(dto.password, 5)
    const user = await this.userService.create({email: dto.email, password: hasPassword})

    const mailStatus = await this.mailService.generateActivationLink(user.id, user.email)

    const userPreparation = filterPrivateFields({...user, isActivate: mailStatus.isActivate}, ["password"])
    const {refreshToken, accessToken} = this.tokenService.generateToken(userPreparation)
    const savedTokenRecord = await this.tokenService.saveToken(user.id, refreshToken)

    user.tokenId = savedTokenRecord.id
    user.mailId = mailStatus.id
    await user.save()

    return {
      user: {
        id: user.dataValues.id,
        email: user.dataValues.email,
        isActivate: mailStatus.isActivate
      },
      refreshToken,
      accessToken,
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

  async validateUser(email: string) {
    const user = await this.userService.getUserByEmail(email)
    if(user) return await this.generateTokens(user)

    const newUser = await this.userService.create({email})
    const mailStatus = await this.mailService.generateActivationLink(newUser.id, newUser.email)

    const userPreparation = filterPrivateFields({...newUser, isActivate: mailStatus.isActivate}, ["password"])
    const {refreshToken, accessToken} = this.tokenService.generateToken(userPreparation)
    const savedTokenRecord = await this.tokenService.saveToken(newUser.id, refreshToken)

    newUser.tokenId = savedTokenRecord.id
    newUser.mailId = mailStatus.id
    await newUser.save()

    return {
      user: {
        id: newUser.dataValues.id,
        email: newUser.dataValues.email,
        isActivate: mailStatus.isActivate
      },
      refreshToken,
      accessToken,
    }
  }


}
