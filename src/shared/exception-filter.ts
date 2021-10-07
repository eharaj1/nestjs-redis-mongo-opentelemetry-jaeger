import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter{
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        let message = exception.getResponse();
        if (typeof message == 'object') {
                message = Array.isArray(message['message']) ? message['message'][0] : message['message'];
        }
    
        response
          .status(status)
          .json({
            success: false,
            message: message
          });
      }
}
