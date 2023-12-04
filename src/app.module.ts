import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeviceModule } from './device/device.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Device } from './device/entities/device.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'host.docker.internal',
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: 'nestjs_devices',
      entities: [Device],
      synchronize: true,
    }),
    DeviceModule,
    AuthModule,
    ClientsModule.register([
      {
        name: 'User_MICROSERVICE',
        transport: Transport.TCP,
        options: {
          host: 'host.docker.internal',
          port: parseInt(process.env.USER_MICROSERVICE_PORT),
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
