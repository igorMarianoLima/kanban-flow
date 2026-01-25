import { Module } from '@nestjs/common';
import { BullConfigModule } from 'src/modules/bull-config/bull-config.module';
import { EmailQueueProcessorModule } from 'src/queues/email/processor/email-queue-processor.module';

@Module({
  imports: [BullConfigModule, EmailQueueProcessorModule],
})
export class WorkerModule {}
