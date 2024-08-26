import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name,) private userModel: Model<User>
  ){

  }

  create(createUserDto: CreateUserDto):Promise<User>{
    // console.log(createUserDto);

    try {
      const newUser = new this.userModel(createUserDto);
      //1- encriptar la contraseña
      //2- Guardar el usuario
      //3- Generar el JWT
      return newUser.save();
      
    } catch (error) {
      console.log(error.code);
      if (error.code === 11000) {
        throw new BadRequestException(`${createUserDto.email} al ready exist`)
      }
      throw new InternalServerErrorException(`Somenthing terrible happend`)
      
    }

    
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
