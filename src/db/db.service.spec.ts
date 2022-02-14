import { Test, TestingModule } from '@nestjs/testing';
import { DbService } from './db.service';
import { DbTestingModule } from './dbTesting.module';
import { initTestDataset } from './dbTestDataset';

describe('ApiService', () => {
  let api: DbService;
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [...DbTestingModule()],
      providers: [DbService],
    }).compile();

    api = module.get<DbService>(DbService);
    await initTestDataset();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('test api results', () => {
    it('return api id', async () => {
      await expect(api.getId('123')).resolves.toBe(1);
      await expect(api.getId('456')).resolves.toBe(2);
      await expect(api.getId('2333333')).resolves.toBeUndefined();
    });

    it('test most used', async () => {
      const { apiId, count } = await api.getMostUsedApi();
      expect(apiId).toBe(1);
      expect(count).toBe(4);
    });

    it('get average requests', async () => {
      const avg = await api.getAverageRequests(
        new Date(Date.now() - 60000 * 60),
        new Date(),
      );
      expect(avg).toBe(2.5);
    });

    it('usage 3 hours', async () => {
      const requestStats = await api.getRequestsPer3HoursPeriod();
      expect(requestStats).not.toBeUndefined();
      expect(requestStats).not.toBeNull();
    });

    it('check usage', async () => {
      await expect(api.getUsage(1)).resolves.toBe(4);
    });

    it('add request', async () => {
      await expect(api.addRequest(1, '123', 1)).resolves.toBeUndefined();
      await expect(api.addRequest(1, '123')).resolves.toBeUndefined();
      await expect(api.addRequest(2, '12311111', 100)).resolves.toBeUndefined();
    });

    it('get total requests', async () => {
      await expect(
        api.getTotalRequests(new Date(0), new Date()),
      ).resolves.not.toBeNaN();
    });
  });
});
