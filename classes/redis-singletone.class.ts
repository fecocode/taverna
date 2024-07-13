import Redis from 'ioredis';
import type { RuntimeConfig } from 'nuxt/schema';

class RedisSingleton {
  private static instance: Redis;

  private constructor() { }

  public static getInstance(runtimeConfig: RuntimeConfig): Redis {
    if (!RedisSingleton.instance) {
      RedisSingleton.instance = new Redis(runtimeConfig.REDIS_URL);
    }
    return RedisSingleton.instance;
  }
}

export default RedisSingleton