import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UserCacheService {
  private readonly prefix = 'users';

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async getUser(uuid: string): Promise<User | undefined> {
    return this.cacheManager.get(`${this.prefix}:${uuid}`);
  }

  async setUser(uuid: string, data: User) {
    const TWO_MINUTES = 2 * 60 * 1000;
    await this.cacheManager.set(`${this.prefix}:${uuid}`, data, TWO_MINUTES);
  }

  async invalidateUser(uuid: string) {
    await this.cacheManager.del(uuid);
  }
}
