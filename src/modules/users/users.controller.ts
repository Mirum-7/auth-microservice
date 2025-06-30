import { Metadata, type ServerUnaryCall } from '@grpc/grpc-js';
import { Controller, Get } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('/')
export class UsersController {
  @Get()
  hello() {
    return { hello: 'hello' };
  }

  @GrpcMethod('UsersService')
  createOne(data: any, metadata: Metadata, call: ServerUnaryCall<any, any>) {
    console.log(data);
    return {
      ...data,
      id: 'asdasd',
      createdAt: 'asdasd',
      updatedAt: 'asdasd',
    };
  }
}
