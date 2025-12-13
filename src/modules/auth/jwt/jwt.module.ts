import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        return {
          secret: configService.get<string>('JWT_SECRET', 'secret'),
          signOptions: { expiresIn: 3 * 24 * 60 * 60 },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy],
  exports: [JwtModule],
})
export class JwtAuthModule {}
