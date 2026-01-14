import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async hash(value: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(value, salt);
  }

  async compare(value: string, hash: string) {
    return bcrypt.compare(value, hash);
  }
}
