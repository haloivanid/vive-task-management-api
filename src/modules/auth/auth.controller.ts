import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { RegisterRequestDto } from './dto/request/register.request.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoginResponseDto } from './dto/response/login.response.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LoginQuery } from './services/query/login.query';
import { LoginRequestDto } from './dto/request/login.request.dto';
import { plainToInstance } from 'class-transformer';
import { JwtBlacklist } from './jwt/jwt.blacklist';
import { FastifyRequest } from 'fastify';
import { RegisterCommand } from './services/command/register.command';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterRequestDto): Promise<null> {
    const registerCommand = new RegisterCommand(registerUserDto);
    return this.commandBus.execute(registerCommand);
  }

  @Post('login')
  async login(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    const loginQuery = plainToInstance(LoginQuery, loginDto);
    return this.queryBus.execute(loginQuery);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() req: FastifyRequest): Promise<null> {
    JwtBlacklist.blacklist(req.headers.authorization as string);
    return null;
  }
}
