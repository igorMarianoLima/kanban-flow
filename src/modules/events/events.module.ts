import { Global, Module } from '@nestjs/common';
import { EmailEventsListener } from './listeners/email-events.listener';
import { EmailModule } from '../email/email.module';

@Global()
@Module({
  imports: [EmailModule],
  providers: [EmailEventsListener],
})
export class EventsModule {}
