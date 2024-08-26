import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayLoad } from 'src/auth/interfaces/jwt.payload';

@Injectable()
export class AuthGuard implements CanActivate {


  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ){

  }
  async canActivate(context: ExecutionContext):Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // console.log(request);
    const token = this.extractTokenFromHeader(request);
    // console.log({token});

    if (!token) {
      throw new UnauthorizedException('No ahi token');
    }


    try {
      const payload = await this.jwtService.verifyAsync<JwtPayLoad>(
        token,
        {
          secret: process.env.JWT_SEED
        }
      );
      // console.log({payload});       


      const user = await this.authService.findUserById(payload.id);
      if (!user) {
        throw new UnauthorizedException('No does not exists');
      }
      if (!user.isActive) {
        throw new UnauthorizedException('User is not active');
      }
      request['user'] = user;


    } catch (error) {
      throw new UnauthorizedException();
    }

    


    return true
  }


  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
