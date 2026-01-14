import { Global, Module } from '@nestjs/common';
import { ConfigModule as ConfigModuleNest } from '@nestjs/config';
import { ConfigService } from './config.service';
import dbConfig from './configs/db.config';
import environmentConfig from './configs/environment.config';
import jwtConfig from './configs/jwt.config';

@Global()
@Module({
  imports: [
    ConfigModuleNest.forRoot({
      load: [dbConfig, environmentConfig, jwtConfig],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
