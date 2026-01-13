import { Injectable } from '@nestjs/common';
import { ConfigService as ConfigServiceNest } from '@nestjs/config';
import { DbConfig } from './configs/db.config';

@Injectable()
export class ConfigService {
  constructor(private readonly configService: ConfigServiceNest) {}

  getDbConfig() {
    return this.configService.get<DbConfig>('db')!;
  }
}
