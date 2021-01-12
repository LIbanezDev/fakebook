import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { MarketModule } from '../src/market.module';
import { INestApplication } from '@nestjs/common';

describe('MarketController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [MarketModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
