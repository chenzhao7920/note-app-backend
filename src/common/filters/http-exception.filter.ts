//Global exception filter for consistent error responses
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception instanceof HttpException
             ? exception.getStatus()
             : HttpStatus.INTERNAL_SERVER_ERROR
    const message = exception instanceof HttpException
             ? exception.getResponse()
             : 'Internal server error'


    response.status(status).json({
      success: false,
      httpCode: status,
      message: typeof message === 'string' ? message : (message as any).message || "Error",
      data: null,
      timestamp: new Date().toISOString(),
    });
  }
}