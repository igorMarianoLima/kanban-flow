import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(
    @Body()
    payload: LoginDto,
  ) {
    return this.authService.login(payload);
  }

  @Post('signup')
  signUp(
    @Body()
    payload: SignupDto,
  ) {
    return this.authService.signup(payload);
  }
}
