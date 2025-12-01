import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

import { GoogleStrategy } from './../src/modules/auth/strategies/google.strategy';
import { GithubStrategy } from './../src/modules/auth/strategies/github.strategy';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(() => {
    process.env.GOOGLE_CLIENT_ID = 'mock_client_id';
    process.env.GOOGLE_CLIENT_SECRET = 'mock_client_secret';
    process.env.GITHUB_CLIENT_ID = 'mock_github_id';
    process.env.GITHUB_CLIENT_SECRET = 'mock_github_secret';
    process.env.JWT_ACCESS_SECRET = 'mock_jwt_access_secret';
    process.env.JWT_REFRESH_SECRET = 'mock_jwt_refresh_secret';
  });

  beforeEach(async () => {
    try {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideProvider(GoogleStrategy)
        .useValue({ validate: () => {} })
        .overrideProvider(GithubStrategy)
        .useValue({ validate: () => {} })
        .compile();

      app = moduleFixture.createNestApplication();
      await app.init();
    } catch (error) {
      console.error('App creation failed:', error);
      require('fs').writeFileSync(
        'e2e-error.log',
        JSON.stringify(error, Object.getOwnPropertyNames(error)),
      );
      throw error;
    }
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('should register, login and access protected route', async () => {
    const email = `test-${Date.now()}@example.com`;
    const password = 'password123';
    const fullName = 'Test User';

    // 1. Register
    console.log('1. Registering...');
    const regRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password, fullName });

    if (regRes.status !== 201) {
      console.error('Register failed status:', regRes.status);
      console.error('Register failed body:', JSON.stringify(regRes.body));
      console.error('Register failed text:', regRes.text);
    }
    expect(regRes.status).toBe(201);

    // 2. Login
    console.log('2. Logging in...');
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password });

    if (loginResponse.status !== 201) {
      console.error('Login failed:', loginResponse.body);
    }
    expect(loginResponse.status).toBe(201);

    const { accessToken } = loginResponse.body;
    expect(accessToken).toBeDefined();

    // 3. Access Protected Route
    console.log('3. Accessing Me...');
    const meResponse = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${accessToken}`);

    if (meResponse.status !== 200) {
      console.error('Me failed:', meResponse.body);
    }
    expect(meResponse.status).toBe(200);

    expect(meResponse.body.email).toBe(email);
  });
});
