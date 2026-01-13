import { Global, Module } from '@nestjs/common';
import { ConfigModule as ConfigModuleNest } from '@nestjs/config';
import { ConfigService } from './config.service';
import dbConfig from './configs/db.config';

@Global()
@Module({
  imports: [
    ConfigModuleNest.forRoot({
      load: [dbConfig],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
