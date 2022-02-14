import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { RateLimitGuard } from './RateLimitGuard';
import { DbService } from '../db/db.service';
import { createMock } from '@golevelup/nestjs-testing';

describe('Guards', () => {
  let guard: RateLimitGuard;
  let reflector: Reflector;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateLimitGuard,
        {
          provide: Reflector,
          useValue: {
            constructor: jest.fn(),
            get: jest.fn(),
          },
        },
        {
          provide: DbService,
          useValue: {
            getId: (id: string) => {
              const ids = {
                '123': 1,
                '456': 2,
              };
              return ids[id];
            },
            getUsage: (id: number) => (id == 1 ? 0 : 100),
            addRequest: (id: number, msg: string, weight: number) => jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RateLimitGuard>(RateLimitGuard);
    reflector = module.get<Reflector>(Reflector);

    //app.get<>
    //const reflector = app.get<Reflector>(Reflector);
    //guard = new RateLimitGuard(apiService as any, reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it(`should return true with no weight`, async () => {
    const context = createMock<ExecutionContext>();
    await expect(guard.canActivate(context)).resolves.toBeTruthy();
  });

  it(`should throw with weight and no api`, async () => {
    const context = createMock<ExecutionContext>();
    jest.spyOn(reflector, 'get').mockImplementation((a: any, b: any) => 1);

    context.switchToHttp().getRequest.mockReturnValue({
      headers: {
        authorization: 'auth',
      },
    });

    await expect(guard.canActivate(context)).rejects.toThrowError(
      'Unauthorized',
    );
  });

  it(`should throw with weight and empty api`, async () => {
    const context = createMock<ExecutionContext>();
    jest.spyOn(reflector, 'get').mockImplementation((a: any, b: any) => 1);

    context.switchToHttp().getRequest.mockReturnValue({
      query: {
        api: '',
      },
    });

    await expect(guard.canActivate(context)).rejects.toThrowError(
      'Unauthorized',
    );
  });

  it(`should throw with weight and wrong api`, async () => {
    const context = createMock<ExecutionContext>();
    jest.spyOn(reflector, 'get').mockImplementation((a: any, b: any) => 1);

    context.switchToHttp().getRequest.mockReturnValue({
      query: {
        api: '+++',
      },
    });

    await expect(guard.canActivate(context)).rejects.toThrowError(
      'Unauthorized',
    );
  });

  it(`should return true`, async () => {
    const context = createMock<ExecutionContext>();
    jest.spyOn(reflector, 'get').mockImplementation((a: any, b: any) => 1);

    context.switchToHttp().getRequest.mockReturnValue({
      query: {
        api: '123',
      },
    });

    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it(`should return ratelimit error`, async () => {
    const context = createMock<ExecutionContext>();
    jest.spyOn(reflector, 'get').mockImplementation((a: any, b: any) => 100);

    context.switchToHttp().getRequest.mockReturnValue({
      query: {
        api: '456',
      },
    });
    await expect(guard.canActivate(context)).rejects.toThrowError('RATE_LIMIT');
  });
});
