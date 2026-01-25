import { Module } from '@nestjs/common';
import { BullConfigModule } from 'src/modules/bull-config/bull-config.module';

@Module({
  imports: [BullConfigModule],
})
export class WorkerModule {}
