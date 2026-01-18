export abstract class EmailAdapterContract {
  abstract sendEmail(): Promise<void>;
}
