import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsSchema } from '../schemas/cats.scheme';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
    imports : [
        MongooseModule.forFeature([{
            name: 'Cats',
            schema: CatsSchema,
          }])
        ],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}