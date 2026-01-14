import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JWT_PAYLOAD_KEY } from '../auth.constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest() as Request;

      const token = request.headers['authorization']?.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException('Authorization header missing');
      }

      const payload = await this.jwtService.verifyAsync(token);

      request[JWT_PAYLOAD_KEY] = payload;

      return true;
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }

      if (err instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      }

      throw new UnauthorizedException('Unauthorized');
    }
  }
}
