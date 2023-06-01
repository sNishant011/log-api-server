import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    switch (exception.code) {
      case 11000:
        response.status(409).json({
          statusCode: 409,
          message: 'Some fields are already taken',
          error: exception.message,
        });
    }
  }
}
