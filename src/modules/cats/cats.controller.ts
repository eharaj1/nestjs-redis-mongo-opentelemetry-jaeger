import { Controller, Get,  Query, Post, Body, HttpException, HttpStatus, Param, UseFilters } from '@nestjs/common';
import {CatCreateValidator} from '../dto/validator.dto'
import {CatsService} from './cats.service';
import { RedisService } from '../../shared/lib/redis/redis.service';
import { HttpExceptionFilter } from '../../shared/exception-filter';
import { SpanKind, SpanStatusCode, trace } from '@opentelemetry/api';
import { NetTransportValues, SemanticAttributes } from '@opentelemetry/semantic-conventions';


const tracer = trace.getTracer("my-application", "0.1.0");
@Controller('cats')
export class CatsController {

constructor(private readonly catsService: CatsService, private readonly redis: RedisService) {}

  @UseFilters(new HttpExceptionFilter())
  @Get()
  async findAll() {
    try{
        return this.catsService.getAll();
    }catch(error){
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    
  }

  @Get('/redis-set')
  async setRedis(){

    //////////// span create ////////////////
    const span = tracer.startSpan("Set Redis", {
      attributes: {
        // Attributes from the database trace semantic conventions
        // https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/semantic_conventions/database.md
        [SemanticAttributes.DB_SYSTEM]: "redis",
        [SemanticAttributes.DB_CONNECTION_STRING]: "Server=redis://localhost:1909;TableCache=true;UseCompression=True;MinimumPoolSize=10;MaximumPoolSize=50;",
        [SemanticAttributes.NET_PEER_NAME]: "demo.example.com",
        [SemanticAttributes.NET_PEER_IP]: "192.0.2.12",
        [SemanticAttributes.NET_PEER_PORT]: 3306,
        [SemanticAttributes.NET_TRANSPORT]: NetTransportValues.IP_TCP,
        [SemanticAttributes.DB_REDIS_DATABASE_INDEX]: "Redis Name",
        [SemanticAttributes.DB_STATEMENT]: `Set name: husain`,
        [SemanticAttributes.DB_OPERATION]: "SET",
      },
      kind: SpanKind.CLIENT,
    });
  ///////////////////// 

      const client = await this.redis.getClient('test-redis');
      console.log(await client.set('name', 'husain'));

      //// Span //////
      span.setStatus({
        code: SpanStatusCode.OK,
      });
      span.end();
    ////////////

      return {success: true};
  }

  @Get('/redis-get')
  async getRedis(){
      const client = await this.redis.getClient('test-redis');

       //////////// span create ////////////////
    const span = tracer.startSpan("Get Redis", {
      attributes: {
        // Attributes from the database trace semantic conventions
        // https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/semantic_conventions/database.md
        [SemanticAttributes.DB_SYSTEM]: "redis",
        [SemanticAttributes.DB_CONNECTION_STRING]: "Server=redis://localhost:1909;TableCache=true;UseCompression=True;MinimumPoolSize=10;MaximumPoolSize=50;",
        [SemanticAttributes.NET_PEER_NAME]: "demo.example.com",
        [SemanticAttributes.NET_PEER_IP]: "192.0.2.12",
        [SemanticAttributes.NET_PEER_PORT]: 3306,
        [SemanticAttributes.NET_TRANSPORT]: NetTransportValues.IP_TCP,
        [SemanticAttributes.DB_REDIS_DATABASE_INDEX]: "Redis Name",
        [SemanticAttributes.DB_STATEMENT]: `GET name: husain`,
        [SemanticAttributes.DB_OPERATION]: "GET",
      },
      kind: SpanKind.CLIENT,
    });
  /////////////////////

      console.log(await client.keys("*"))
      
      //// Span //////
      span.setStatus({
        code: SpanStatusCode.OK,
      });
      span.end();
    ////////////

      return {data:await client.get('name')};
  }

  @Get("/:id")
 async getCat(@Param('id') cat_id: string){
   
    try{
        return await this.catsService.getCat(cat_id);
    }catch(error){
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  
  @UseFilters(new HttpExceptionFilter())
  @Post()
  async insertCat(@Body() body: CatCreateValidator){
      try{
        return await this.catsService.insertCat(body);
      }catch(error){
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
      }
    
  }

  
  
}