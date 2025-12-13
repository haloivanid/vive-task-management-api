import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { FastifyReply, FastifyRequest } from 'fastify';
import { randomUUID } from 'crypto';
import { ResponseDto } from '../dto/response.dto';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const http = context.switchToHttp();
    const req = http.getRequest<FastifyRequest>();
    const res = http.getResponse<FastifyReply>();

    const requestId = req.id ?? randomUUID();
    res.status(HttpStatus.OK);
    res.headers({ 'x-request-id': requestId });

    return next.handle().pipe(
      map((data) => {
        const responseDto = new ResponseDto();
        responseDto.request_id = requestId;
        responseDto.success = true;
        responseDto.data = data;

        return responseDto;
      }),
    );
  }
}
