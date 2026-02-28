import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger('HttpExceptionFilter');

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const resp = exception.getResponse();

        const message = typeof resp === 'object' ? (resp as any).message : resp;

        this.logger.error(`${req.method} ${req.url} → ${status}: ${JSON.stringify(message)}`);

        res.status(status).json({
            success: false,
            error: {
                statusCode: status,
                message,
                timestamp: new Date().toISOString(),
                path: req.url,
            },
        });
    }
}
