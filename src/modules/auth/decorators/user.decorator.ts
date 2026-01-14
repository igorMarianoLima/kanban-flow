import {
  createParamDecorator,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { REQUEST_USER_KEY } from '../auth.constants';
import { UserRequestDto } from '../dto/user-request.dto';

export const User = createParamDecorator(
  (data: keyof UserRequestDto, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request[REQUEST_USER_KEY] as UserRequestDto;

    return data ? user[data] : user;
  },
);
