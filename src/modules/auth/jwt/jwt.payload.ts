import { User } from '../../user/user.entity';

export class JwtPayload {
  sub: string;
  email: string;

  constructor(user: User) {
    this.sub = user.id.toString();
    this.email = user.email;
  }
}
