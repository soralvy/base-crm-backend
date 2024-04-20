import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { DatabaseError } from 'pg';
import { QueryFailedError } from 'typeorm';
import { POSTGRES_ERROR_CODES } from '../database/config/postgres-error-codes';

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: QueryFailedError<DatabaseError>, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = this.prepareErrorResponse(exception.driverError);

    httpAdapter.reply(ctx.getResponse(), response, response.statusCode);
  }

  private prepareErrorResponse(originalError: DatabaseError) {
    const timestamp = new Date().toISOString();

    if (!originalError.code) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An unexpected database error occurred',
        timestamp,
        originalError,
      };
    }

    const errorDetails = POSTGRES_ERROR_CODES[originalError.code];
    let message = 'An unexpected database error occurred';

    if (errorDetails) {
      message =
        typeof errorDetails.message === 'function'
          ? errorDetails.message(originalError)
          : errorDetails.message;
      return {
        statusCode: errorDetails.status,
        message,
        timestamp,
        originalError,
      };
    } else {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message,
        timestamp,
        originalError,
      };
    }
  }
}
