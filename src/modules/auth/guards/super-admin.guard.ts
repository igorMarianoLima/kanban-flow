import { CanActivate, ExecutionContext } from '@nestjs/common';
import { REQUEST_USER_KEY } from '../auth.constants';
import { UserRequestDto } from '../dto/user-request.dto';

export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request[REQUEST_USER_KEY] as UserRequestDto;

    return user.isSuperAdmin;
  }
}
