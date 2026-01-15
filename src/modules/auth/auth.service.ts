import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { HashService } from './hash.service';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async login(data: LoginDto) {
    try {
      const user = await this.userService.findOneByEmail(data.email);

      if (!(await this.hashService.compare(data.password, user.password))) {
        throw new UnauthorizedException();
      }

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

  async signup(data: SignupDto) {
    try {
      await this.userService.create(data);

      return this.login({
        email: data.email,
        password: data.password,
      });
    } catch (err) {
      console.log({ err });
      throw err;
    }
  }
}
