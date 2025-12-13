import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/modules/user/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MainModule } from '../src/main.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let configService: ConfigService;

  const testUser = { email: 'test@example.com', password: 'Test123!', firstName: 'Test', lastName: 'User' };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.test' }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (config: ConfigService) => ({
            type: 'postgres',
            host: config.get('DB_HOST', 'localhost'),
            port: config.get<number>('DB_PORT', 5432),
            username: config.get('DB_USERNAME', 'postgres'),
            password: config.get('DB_PASSWORD', 'postgres'),
            database: config.get('DB_DATABASE', 'test_db'),
            entities: [User],
            synchronize: true,
            dropSchema: true,
          }),
          inject: [ConfigService],
        }),
        MainModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    configService = moduleFixture.get<ConfigService>(ConfigService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app.getHttpServer()).post('/auth/register').send(testUser).expect(201);

      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.data).toHaveProperty('email', testUser.email);
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should not register with duplicate email', async () => {
      const response = await request(app.getHttpServer()).post('/auth/register').send(testUser).expect(400);

      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);

      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
    });

    it('should not login with invalid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' })
        .expect(401);

      expect(response.body).toHaveProperty('status', 'error');
    });
  });

  describe('POST /auth/refresh', () => {
    let refreshToken: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email, password: testUser.password });

      refreshToken = response.body.data.refreshToken;
    });

    it('should refresh access token with valid refresh token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${refreshToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.data).toHaveProperty('accessToken');
    });
  });

  describe('POST /auth/logout', () => {
    let accessToken: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email, password: testUser.password });

      accessToken = response.body.data.accessToken;
    });

    it('should logout successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'success');
    });
  });
});
