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
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException ? exception.getStatus() : 500;

        const responseBody: any =
            exception instanceof HttpException
                ? exception.getResponse()
                : {
                    message: 'Internal server error',
                    details: (exception as any)?.message,
                };

        // full logging
        this.logger.error({
            path: req.path,
            method: req.method,
            exception,
            timestamp: new Date().toISOString(),
        });

        res.status(status).json({
            statusCode: status,
            // keep `error` field for client dev UI
            error: responseBody,
            timestamp: new Date().toISOString(),
            path: req.url,
        });
    }
}
