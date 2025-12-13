import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        ({
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
        }) as JwtModuleOptions,
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: JwtConfig,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        refreshSecret: configService.get<string>('JWT_REFRESH_SECRET'),
        refreshExpiresIn: configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
      }),
      inject: [ConfigService],
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
