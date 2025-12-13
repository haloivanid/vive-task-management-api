import { User } from '../../user/user.entity';

export class AuthResponseDto {
  status: string;
  data: UserResponseDto;
  message?: string;
}

export class UserResponseDto {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}

export class AuthErrorResponseDto {
  status: string;
  message: string;
}
