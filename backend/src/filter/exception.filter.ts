import { Request, Response } from 'express';

import { QueryFailedError } from 'typeorm';

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { ConfigService } from '@nestjs/config';

import { ErrorCode } from '@constants/error-code';
import { BaseError } from '@exceptions/errors';

import { I18nService } from '@src/i18n/i18n.service';
import { IResponseBody } from '@src/interface';
import { isDev } from '@utils/util';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    constructor(
        private readonly configService: ConfigService,
        private i18n: I18nService,
    ) {}

    private handleResponse(
        request: Request,
        response: Response,
        exception: HttpException | QueryFailedError | Error,
    ): void {
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let errorCode = ErrorCode.UNKNOWN;
        let message = 'Internal server error';
        let responseBody: IResponseBody = {
            statusCode: statusCode,
            errorCode: errorCode,
            message: message,
        };
        if (exception instanceof BaseError) {
            statusCode = exception.getStatus();
            errorCode = exception.getErrorCode();
            message =
                typeof exception.getResponse() == 'string'
                    ? exception.getResponse()
                    : JSON.parse(JSON.stringify(exception.getResponse()))?.message;
            responseBody = {
                statusCode: statusCode,
                errorCode: errorCode,
                message: message,
            };
        } else if (exception instanceof HttpException) {
            const responseException = exception.getResponse();
            statusCode = exception.getStatus();
            errorCode = ((responseException as Record<string, unknown>)?.errorCode as number) || ErrorCode.UNKNOWN;
            message =
                typeof exception.getResponse() == 'string'
                    ? exception.getResponse()
                    : JSON.parse(JSON.stringify(exception.getResponse()))?.message;
            responseBody = {
                statusCode: statusCode,
                errorCode: errorCode,
                message: message,
            };
        } else if (exception instanceof QueryFailedError) {
            statusCode = HttpStatus.BAD_REQUEST;
            errorCode = ErrorCode.DATABASE_ERROR;
            message = isDev() ? exception.message : 'Query database error.';
            responseBody = {
                statusCode: statusCode,
                errorCode: errorCode,
                message: message,
            };
        } else if (exception instanceof Error) {
            statusCode = HttpStatus.BAD_REQUEST;
            errorCode = ErrorCode.UNKNOWN;
            message = exception.message;
            responseBody = {
                statusCode: statusCode,
                errorCode: errorCode,
                message: message,
            };
        }

        if (Array.isArray(responseBody.message)) {
            responseBody.message = responseBody.message[0];
        }
        if (responseBody.message) responseBody.message = this.i18n.lang(responseBody.message as string);
        response.status(statusCode).send(responseBody);
        this.handleMessage(exception, request, responseBody);
    }

    catch(exception: HttpException | Error | BaseError, host: ArgumentsHost): void {
        const ctx: HttpArgumentsHost = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();
        // Handling error message and logging

        // Response to client
        this.handleResponse(request, response, exception);
    }

    private handleMessage(
        exception: HttpException | QueryFailedError | Error,
        request: Request,
        responseBody: IResponseBody,
    ): void {
        let message = 'Internal Server Error';

        if (exception instanceof HttpException || exception instanceof BaseError) {
            message = JSON.stringify(exception.getResponse());
        } else if (exception instanceof QueryFailedError) {
            message = exception.stack.toString();
        } else if (exception instanceof Error) {
            message = exception.stack.toString();
            if (message.includes('no such file or directory')) {
                message = 'Not Found';
            }
        }

        const { body, headers, ip, method, params, query } = request;
        const user = (request as unknown as Record<string, string>)?.user;

        const url: string = request.headers['x-envoy-original-path']
            ? (request.headers['x-envoy-original-path'] as string)
            : request.url;
    }
}
