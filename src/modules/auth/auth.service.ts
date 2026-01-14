import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginDto) {
    try {
      const user = await this.userService.findOneByEmail(data.email);

      if (user.password !== data.password) throw new NotFoundException();

      const accessToken = await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
      });

      return {
        accessToken,
      };
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new UnauthorizedException('Invalid email/password');
      }

      throw err;
    }
  }
}
