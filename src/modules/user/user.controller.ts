import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from '../../library/decorators/get-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('me')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  @Get()
  getMe(@GetUser() me: User) {
    return me;
  }
}
