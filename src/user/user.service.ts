import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.model";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly userRepository: typeof User) {}

  async create(dto: CreateUserDto){
    return await this.userRepository.create(dto)
  }

  async getUserByEmail(email: string){
    return await this.userRepository.findOne({where: {email}})
  }

  async getUserById(id: number) {
    return await this.userRepository.findOne({where: {id}})
  }

  async getAllUsers(){
    return await this.userRepository.findAll()
  }
}
