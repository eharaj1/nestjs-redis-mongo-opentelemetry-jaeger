import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ResponseDTO } from '../dto/response.dto';
import  {CATS_MESSAGES}  from 'src/shared/constants';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICats } from '../interfaces/cats.interface';
import { SpanKind, SpanStatusCode, trace } from '@opentelemetry/api';
import { NetTransportValues, SemanticAttributes } from '@opentelemetry/semantic-conventions';

const tracer = trace.getTracer("my-application", "0.1.0");
@Injectable()
export class CatsService {

    constructor(
        @InjectModel('Cats') private readonly catsModel: Model<ICats>
        ) {}
  

     async getAll(): Promise<any> {
        const resDTO = new ResponseDTO();

        //////////// span create ////////////////
        const span = tracer.startSpan("SELECT DemoDB.Cats", {
            attributes: {
              // Attributes from the database trace semantic conventions
              // https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/semantic_conventions/database.md
              [SemanticAttributes.DB_SYSTEM]: "mysql",
              [SemanticAttributes.DB_CONNECTION_STRING]: "Server=shopdb.example.com;Database=ShopDb;Uid=billing_user;TableCache=true;UseCompression=True;MinimumPoolSize=10;MaximumPoolSize=50;",
              [SemanticAttributes.DB_USER]: "app_user",
              [SemanticAttributes.NET_PEER_NAME]: "demo.example.com",
              [SemanticAttributes.NET_PEER_IP]: "192.0.2.12",
              [SemanticAttributes.NET_PEER_PORT]: 3306,
              [SemanticAttributes.NET_TRANSPORT]: NetTransportValues.IP_TCP,
              [SemanticAttributes.DB_NAME]: "DemoDB",
              [SemanticAttributes.DB_STATEMENT]: `Select * from cats`,
              [SemanticAttributes.DB_OPERATION]: "SELECT",
              [SemanticAttributes.DB_SQL_TABLE]: "Cats",
            },
            kind: SpanKind.CLIENT,
          });
        ///////////////////// 

        const cats = await this.catsModel.find().catch(err => {
             return null;
         });;

         if(!cats)
            throw new HttpException(CATS_MESSAGES.CAT_NOTFOUND,  HttpStatus.NOT_FOUND)
         //// Span //////
            span.setStatus({
                code: SpanStatusCode.OK,
            });
            span.end();
        ////////////
        resDTO.success = true;
        resDTO.data = cats;
        return resDTO;
      
    }

     async getCat(cat_id: string): Promise<any> {
        const resDTO = new ResponseDTO();
        const cat = await this.catsModel.findById(cat_id)
        if(cat){
            resDTO.success = true;
            resDTO.data = cat; 
        }else{
            resDTO.success = false;
            resDTO.message = CATS_MESSAGES.CAT_NOTFOUND;
        }
        return resDTO;
    }
    insertCat(cat: any): ResponseDTO{
        const resDTO = new ResponseDTO();
        this.catsModel.create(cat);
        resDTO.success = true;
        resDTO.data = cat;
        resDTO.message = CATS_MESSAGES.CAT_CREATED;
        return resDTO;
    }
  }