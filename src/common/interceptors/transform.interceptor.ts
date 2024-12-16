//Custom transform interceptor for standardized responses
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const response = context.switchToHttp().getResponse()
    return next.handle().pipe(
      map((data) => ({
        success: true,
        httpCode: response.statusCode,
        message: response.message || "Operation successful",
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}