import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AppQueue } from 'src/common/enums/app-queue.enum';
import { EmailQueueProducerService } from './email-queue-producer.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: AppQueue.EMAIL,
    }),
  ],
  providers: [EmailQueueProducerService],
  exports: [EmailQueueProducerService],
})
export class EmailQueueProducerModule {}
