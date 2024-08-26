import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcryptjs from "bcryptjs";
import { JwtService } from '@nestjs/jwt';
import { JwtPayLoad } from './interfaces/jwt.payload';
import { LoginResponse } from './interfaces/login-response';
import { RegisterDto, LoginDto,UpdateAuthDto,CreateUserDto } from './dto';



@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name,) private userModel: Model<User>,
    private jwtService: JwtService
  ){

  }

  async create(createUserDto: CreateUserDto):Promise<User>{
    // console.log(createUserDto);

    try {
      const {password,...userData} = createUserDto;

      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password,10),
        ... userData
      });


      await newUser.save();
      const {password:_, ...user} = newUser.toJSON()

      return user


      // const newUser = new this.userModel(createUserDto);
      
      
    } catch (error) {
      console.log(error.code);
      if (error.code === 11000) {
        throw new BadRequestException(`${createUserDto.email} al ready exist`)
      }
      throw new InternalServerErrorException(`Somenthing terrible happend`)
      
    }

    
  }


  async register(registerDto:RegisterDto):Promise<LoginResponse>{

    // console.log({registerDto});
    const user = await this.create(registerDto);
    
    
    return {
      user:user,
      token: this.getJwtToken({id:user._id})
    }
  }

  async login (loginDto:LoginDto): Promise<LoginResponse> {
    // console.log({loginDto});
    const {email, password} = loginDto

    const user = await this.userModel.findOne({email:email});
    if (!user) {
      throw new UnauthorizedException('Not valid credentials - email')
    }
    if (!bcryptjs.compareSync(password, user.password)) {
      throw new UnauthorizedException('Not valid credentials - Password')
    }

    const {password:_, ...rest} = user.toJSON()

    return {
      user: rest,
      token: this.getJwtToken({id:user.id})

    }

    
    /**  
      * User {_id, nam, email, roles}
      * Token -> ASDASDA.ASDASDA.ASDASDA
    */
  }

  getJwtToken(payload:JwtPayLoad) {
    const token = this.jwtService.sign(payload);
    return token

  }

  async findUserById (id: string) {
    const user = await this.userModel.findById(id)
    const {password, ...rest} = user.toJSON();
    return rest;
  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
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
