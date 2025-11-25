import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : 500;

        console.error('[AllExceptionsFilter] -', {
            path: request.url,
            method: request.method,
            exception,
            stack: exception?.stack,
        });

        response.status(status).json({
            statusCode: status,
            message: exception.message || 'Internal server error',
            error: exception?.code || null,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
