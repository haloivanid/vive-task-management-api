export class User {
  private readonly _id: number;
  private _name: string;
  private _email: string;
  private _password: string;
  private _emailVerifiedAt: Date | null;
  private _rememberToken: string | null;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    emailVerifiedAt: Date | null = null,
    rememberToken: string | null = null,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._password = password;
    this._emailVerifiedAt = emailVerifiedAt;
    this._rememberToken = rememberToken;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static create(name: string, email: string, password: string, id?: number): User {
    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required');
    }

    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (!id) {
      throw new Error('ID is required for User creation');
    }

    return new User(id, name, email, password);
  }

  static reconstitute(
    id: number,
    name: string,
    email: string,
    password: string,
    emailVerifiedAt: Date | null,
    rememberToken: string | null,
    createdAt: Date,
    updatedAt: Date,
  ): User {
    return new User(id, name, email, password, emailVerifiedAt, rememberToken, createdAt, updatedAt);
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get emailVerifiedAt(): Date | null {
    return this._emailVerifiedAt;
  }

  get rememberToken(): string | null {
    return this._rememberToken;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateProfile(name: string, email: string): void {
    if (!name || !email) {
      throw new Error('Name and email are required');
    }

    if (!User.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    this._name = name;
    this._email = email;
    this._updatedAt = new Date();
  }

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    if (!(await this.validatePassword(currentPassword))) {
      throw new Error('Current password is incorrect');
    }

    if (!newPassword) {
      throw new Error('New password is required');
    }

    this._password = await this.hashPassword(newPassword);
    this._updatedAt = new Date();
  }

  markEmailAsVerified(): void {
    this._emailVerifiedAt = new Date();
    this._updatedAt = new Date();
  }

  async validatePassword(password: string): Promise<boolean> {
    return this.comparePassword(password, this._password);
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private async hashPassword(password: string): Promise<string> {
    const bcrypt = await import('bcrypt');
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  private async comparePassword(plainText: string, hashed: string): Promise<boolean> {
    const bcrypt = await import('bcrypt');
    return bcrypt.compare(plainText, hashed);
  }

  getEmailForPasswordReset(): { email: string; name: string } {
    return { email: this._email, name: this._name };
  }
}
