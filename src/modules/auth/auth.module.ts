import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeormEntity } from '../../database/entities/user.typeorm-entity';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt/jwt.strategy';
import { CqrsModule } from '@nestjs/cqrs';
import { RegisterCommandHandler } from './services/command/register.command';
import { LoginQueryHandler } from './services/query/login.query';
import { JwtAuthModule } from './jwt/jwt.module';

const CommandHandlers = [RegisterCommandHandler];
const QueryHandlers = [LoginQueryHandler];

@Module({
  imports: [TypeOrmModule.forFeature([UserTypeormEntity]), CqrsModule, JwtAuthModule],
  controllers: [AuthController],
  providers: [JwtStrategy, ...CommandHandlers, ...QueryHandlers],
  exports: [],
})
export class AuthModule {}
