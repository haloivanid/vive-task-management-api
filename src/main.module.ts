import { Module } from '@nestjs/common';
import { minutes, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { ProjectModule } from './modules/project/project.module';
import { TaskModule } from './modules/task/task.module';

@Module({
  imports: [
    RouterModule.register([{ path: 'api', children: [AuthModule, UserModule, ProjectModule, TaskModule] }]),
    ThrottlerModule.forRoot([{ name: 'default', limit: minutes(60), ttl: 100 }]),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    ProjectModule,
    TaskModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          entities: [__dirname + '/**/*.typeorm-entity{.ts,.js}'],
          synchronize: false,
          logging: configService.get('NODE_ENV') === 'development',
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class MainModule {}
