import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { getModelToken } from '@nestjs/mongoose';
import { RedisService } from '../../shared/lib/redis/redis.service';
import {RedisModule} from "../../shared/lib/redis/redis.module";
const REDIS_MODULE_OPTIONS = Symbol('REDIS_MODULE_OPTIONS');
const REDIS_CLIENT = Symbol('REDIS_CLIENT');
describe('CatsController', () => {
    let controller: CatsController;
    let service: CatsService;
    
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      //imports: [RedisModule],
      controllers: [CatsController],
      providers: [CatsService, RedisModule,   RedisService , { provide: getModelToken('Cats'), useValue: { Symbol: jest.fn()} }],
    }).compile();

    controller = app.get<CatsController>(CatsController);
    service = app.get<CatsService>(CatsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  const catsData = [{
      cat_name: "cat",
      cat_type: "type",
      cat_color: "black"
  }]
  describe('Cats List', () => {


    it('should return all cats', async() => {
        jest.spyOn(service, 'getAll').mockResolvedValue({data: catsData, success: true})
        const catsList = await controller.findAll()
      expect(catsList).toBe({data: catsData, success: true});
    });

    it('should throw error record not found', async() => {
        jest.spyOn(service, 'getAll').mockRejectedValue({message: 'Records not found'})
        try{
            await controller.findAll();
          }catch(e){
            expect(e.message).toBe('Records not found');
          }
      });

  });
});