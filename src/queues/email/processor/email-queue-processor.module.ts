import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AppQueue } from 'src/common/enums/app-queue.enum';
import { EmailQueueProcessorService } from './email-queue-processor.service';
import { EmailModule } from 'src/modules/email/email.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: AppQueue.EMAIL,
    }),
    EmailModule,
  ],
  providers: [EmailQueueProcessorService],
})
export class EmailQueueProcessorModule {}
