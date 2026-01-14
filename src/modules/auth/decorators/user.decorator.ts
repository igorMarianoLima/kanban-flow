import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JWT_PAYLOAD_KEY } from '../auth.constants';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';

export const User = createParamDecorator(
  (data: keyof JwtPayloadDto, context: ExecutionContext): JwtPayloadDto => {
    const request = context.switchToHttp().getRequest();

    return data ? request[JWT_PAYLOAD_KEY][data] : request[JWT_PAYLOAD_KEY];
  },
);
