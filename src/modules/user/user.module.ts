import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeormEntity } from '../../database/entities/user.typeorm-entity';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';
import { UserController } from './user.controller';
import { GetUserHandler } from './services/query/get-user.query';
import { JwtAuthModule } from '../auth/jwt/jwt.module';

const QueryHandlers = [GetUserHandler];

@Module({
  imports: [JwtAuthModule, TypeOrmModule.forFeature([UserTypeormEntity]), CqrsModule],
  controllers: [UserController],
  providers: [JwtStrategy, ...QueryHandlers],
})
export class UserModule {}
