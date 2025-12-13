import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { email, password, firstName, lastName } = registerUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save user

    const user = this.userRepository.create({ email, password: hashedPassword, firstName, lastName, isActive: true });

    return this.userRepository.save(user);
  }

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = loginUserDto;

    // Find user by email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.jwtConfig.secret,
        expiresIn: this.jwtConfig.expiresIn,
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.jwtConfig.refreshSecret,
        expiresIn: this.jwtConfig.refreshExpiresIn,
      }),
    };
  }

  async refreshToken(user: any) {
    const payload = { sub: user.sub, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.jwtConfig.secret,
        expiresIn: this.jwtConfig.expiresIn,
      }),
    };
  }
}
