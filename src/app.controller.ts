import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('User_MICROSERVICE') private readonly clientDevice: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'hello_world' })
  helloWorld() {
    console.log('hello world from device');
  }

  @Get('trigger-hello')
  triggerHello() {
    this.clientDevice.emit({ cmd: 'hello_world' }, '');
    return 'Triggered hello_world in Microservice1';
  }
}
