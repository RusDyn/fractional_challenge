import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarriersService } from './carriers/carriers.service';
import { APP_GUARD } from '@nestjs/core';
import { RateLimitGuard } from './guards/RateLimitGuard';
import { DbService } from './db/db.service';
import { DbTestingModule } from './db/dbTesting.module';
import { INestApplication } from '@nestjs/common';

describe('AppController', () => {
  let appController: AppController;
  let module: TestingModule;
  let app: INestApplication;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [...DbTestingModule()],
      controllers: [AppController],
      providers: [
        DbService,
        {
          provide: APP_GUARD,
          useClass: RateLimitGuard,
        },
        CarriersService,
        AppService,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    appController = module.get<AppController>(AppController);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('basic tests', () => {
    it('should ensure the RateLimitGuard is applied to the getInfo method', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        AppController.prototype.getInfo,
      );
      const guard = new guards[0]();

      expect(guard).toBeInstanceOf(RateLimitGuard);
    });

    it('should return wrong phone', async () => {
      const number = '+++';
      await expect(appController.getInfo(number)).rejects.toThrowError(
        'WRONG_NUMBER_FORMAT',
      );
    });

    it('should return correct phone', async () => {
      const number = '20101234123';
      const result = await appController.getInfo(number);
      expect(result).toStrictEqual({
        country: 'EG',
        operator: 'Vodafone',
        countryCallingCode: '20',
        nationalNumber: '1234123',
      });
    });

    it('should return correct phone', async () => {
      const number = '12423752606';
      const result = await appController.getInfo(number);
      expect(result).toStrictEqual({
        country: 'VI',
        operator: 'BaTelCo',
        countryCallingCode: '1',
        nationalNumber: '2606',
      });
    });

    it('should return correct phone', async () => {
      const number = '77002554270';
      const result = await appController.getInfo(number);
      expect(result).toStrictEqual({
        country: 'RU',
        operator: 'Altel',
        countryCallingCode: '7',
        nationalNumber: '2554270',
      });
    });
  });
});
