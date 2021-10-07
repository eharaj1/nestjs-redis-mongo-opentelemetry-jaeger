import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from '../cats/cats.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from '../../shared/lib/redis/redis.module';

/// Mongo Connection /////////
const mongooseModule  = MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb://localhost:27017/demo');

// Redis Connection //////////
const redisModule = RedisModule.register({
    name: 'test-redis',
    connectionName: 'test',
    keepAlive: 1,
    connectTimeout: 0,
    host: '127.0.0.1',
    port: 6380
   
})

@Module({
  imports: [
      CatsModule, 
     mongooseModule,
      redisModule,
      ConfigModule.forRoot({
        isGlobal: true,
      })
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
