import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PUBLIC_ROUTE_KEY, REQUEST_USER_KEY } from '../auth.constants';
import { Reflector } from '@nestjs/core';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { UserService } from 'src/modules/user/user.service';
import { UserRequestDto } from '../dto/user-request.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly userService: UserService,
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

      const payload = await this.jwtService.verifyAsync<JwtPayloadDto>(token);
      const user = await this.userService.findOne(payload.sub);

      if (!user) throw new Error('User not found');

      const userRequest: UserRequestDto = {
        id: user.id,
      };

      request[REQUEST_USER_KEY] = userRequest;

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
