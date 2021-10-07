import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';
import { getModelToken } from '@nestjs/mongoose';

const mappingModel = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    };
describe('CatsService', () => {
    let service: CatsService;
    let model: typeof mappingModel;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
        providers: [CatsService, {provide: getModelToken('Cats'), useValue: mappingModel}],
    }).compile();

    service = app.get<CatsService>(CatsService);
    model = app.get(getModelToken('Cats'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(model).toBeDefined();
  });

  const catsData = {
      data: [{
        cat_name: "cat",
        cat_type: "type",
        cat_color: "black"
        }]  
    }

  describe('Cats List', () => {

    it('should return all cats', async() => {
        model.find.mockResolvedValue(catsData);
        const res = await service.getAll();
        expect(res).toEqual({ data: catsData })
        expect(model.find).toHaveBeenCalledTimes(1);
    });

    it('should through in cats list', async() => {
        model.find.mockRejectedValue({message:'hub not found!!'});
        try{
            await service.getAll();
          }catch(e){
            expect(e.message).toBe('records not found');
            expect(model.find).toHaveBeenCalledTimes(1);
          }
      });

  });
});