import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthResponseDto, AuthErrorResponseDto } from './dto/auth-response.dto';
import { UserMapper } from '../user/user.mapper';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<AuthResponseDto | AuthErrorResponseDto> {
    try {
      const user = await this.authService.register(registerUserDto);
      return { status: 'success', data: UserMapper.toResponseDto(user) };
    } catch (error) {
      return { status: 'error', message: 'An error occurred during registration' };
    }
  }

  @Post('login')
  async login(@Body() loginDto: any): Promise<AuthResponseDto | AuthErrorResponseDto> {
    // TODO: Implement login logic
    return { status: 'error', message: 'Not implemented' };
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(): Promise<{ status: string; message: string }> {
    // In a real application, you might want to invalidate the token here
    // For now, we'll just return success
    return { status: 'success', message: 'Logged out successfully' };
  }
}
