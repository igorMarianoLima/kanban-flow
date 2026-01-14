import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JWT_PAYLOAD_KEY, PUBLIC_ROUTE_KEY } from '../auth.constants';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest() as Request;

      const isPublicEndpoint = this.reflector.get<boolean | undefined>(
        PUBLIC_ROUTE_KEY,
        context.getHandler(),
      );

      if (isPublicEndpoint) return true;

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
