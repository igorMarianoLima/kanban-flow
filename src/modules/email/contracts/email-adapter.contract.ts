import { SendEmailDto } from '../dto/send-email.dto';

export abstract class EmailAdapterContract {
  abstract sendEmail(payload: SendEmailDto): Promise<void>;
}
