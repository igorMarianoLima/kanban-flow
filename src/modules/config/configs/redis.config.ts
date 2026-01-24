export interface RedisConfig {
  host: string;
  port: number;
}

export const redisConfig = (): { redis: RedisConfig } => ({
  redis: {
    host: process.env.REDIS_HOST || '',
    port: Number(process.env.REDIS_PORT || 6379),
  },
});
