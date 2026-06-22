// src/common/redis/redis.adapter.ts
import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';
import { Server, ServerOptions } from 'socket.io';

type RedisAdapterConstructor = ReturnType<typeof createAdapter>;

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor?: RedisAdapterConstructor;

  constructor(app: INestApplicationContext) {
    super(app);
  }

  async connectToRedis(configService: ConfigService): Promise<void> {
    const redisUrl = configService.getOrThrow<string>('REDIS_URL');
    const pubClient = new Redis(redisUrl, { lazyConnect: true });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): Server {
    const server = super.createIOServer(port, options) as Server;

    if (this.adapterConstructor) {
      server.adapter(this.adapterConstructor);
    }

    return server;
  }
}
