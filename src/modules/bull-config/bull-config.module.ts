import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisConf = configService.getRedisConfig();

        return {
          connection: {
            host: redisConf.host,
            portt: redisConf.port,
          },
        };
      },
    }),
  ],
  exports: [BullModule],
})
export class BullConfigModule {}
