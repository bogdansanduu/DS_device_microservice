import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import 'dotenv/config';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [],
  providers: [JwtService],
})
export class AuthModule {}
