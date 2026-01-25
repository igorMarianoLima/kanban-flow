import { Global, Module } from '@nestjs/common';
import { EmailEventsListener } from './listeners/email-events.listener';
import { EmailQueueProducerModule } from 'src/queues/email/producer/email-queue-producer.module';

@Global()
@Module({
  imports: [EmailQueueProducerModule],
  providers: [EmailEventsListener],
})
export class EventsModule {}
