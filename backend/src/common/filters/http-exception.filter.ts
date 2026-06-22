// src/common/filters/http-exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

type ErrorResponse = {
  statusCode: number;
  message: string | string[];
  timestamp: string;
  path: string;
};

type NestExceptionBody = {
  message?: string | string[];
  error?: string;
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const statusCode = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception.getResponse();
    const message = this.resolveMessage(exceptionResponse, exception.message);
    const body: ErrorResponse = {
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(statusCode).json(body);
  }

  private resolveMessage(
    exceptionResponse: string | object,
    fallback: string,
  ): string | string[] {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    const body = exceptionResponse as NestExceptionBody;
    return body.message ?? fallback;
  }
}
