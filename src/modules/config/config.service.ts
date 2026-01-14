import { Injectable } from '@nestjs/common';
import { ConfigService as ConfigServiceNest } from '@nestjs/config';
import { DbConfig } from './configs/db.config';
import { EnvironmentConfig } from './configs/environment.config';
import { JwtConfig } from './configs/jwt.config';

@Injectable()
export class ConfigService {
  constructor(private readonly configService: ConfigServiceNest) {}

  getEnvironment() {
    return this.configService.get<EnvironmentConfig>('environment')!;
  }

  getDbConfig() {
    return this.configService.get<DbConfig>('db')!;
  }

  getJwtConfig() {
    return this.configService.get<JwtConfig>('jwt')!;
  }
}
