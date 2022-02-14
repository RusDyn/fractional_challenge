import { Injectable } from '@nestjs/common';
import { ApiKeyHistoryEntity } from '../model/apiKeyHistory.entity';
import { ApiKeyEntity } from '../model/apiKey.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DbService {
  constructor(
    @InjectRepository(ApiKeyHistoryEntity)
    private readonly apiKeyHistoryRepo: Repository<ApiKeyHistoryEntity>,

    @InjectRepository(ApiKeyEntity)
    private readonly apiKeyRepo: Repository<ApiKeyEntity>,
  ) {}

  /**
   * Get Api Id by Api Key
   * @param key representing api
   * @return api id or undefined if api not found
   */
  async getId(key: string): Promise<number | undefined> {
    if (!key || key.length == 0) {
      return undefined;
    }

    const result = await this.apiKeyRepo.findOne({
      where: { key },
      select: ['id'],
    });
    return result ? result.id : undefined;
  }

  /**
   * Get usage for the last time
   * @param apiId - api id
   * @param usageTime - time in ms from now. Default: 1 min
   * @return usage amount
   */
  async getUsage(apiId, usageTime = 60000): Promise<number> {
    const time = new Date(Date.now() - usageTime); // 1 min ago

    const { sum } = await this.apiKeyHistoryRepo
      .createQueryBuilder('items')
      .where('items.apiId = :apiId and time >= :time', { apiId, time })
      .select('sum(weight) as sum')
      .getRawOne();

    return parseInt(sum) || 0;
  }

  /**
   * Adds request to the history
   * @param apiId
   * @param message to store data of the request
   * @param weight of the request
   */
  async addRequest(apiId: number, message: string, weight = 1): Promise<void> {
    await this.apiKeyHistoryRepo.insert({
      apiId,
      message,
      weight,
    });
  }

  /**
   * BONUS: Sum of all request in specific time frame
   * @param from date
   * @param to date
   * @return summarized weight of all requests in the given period
   */
  async getTotalRequests(from: Date, to: Date): Promise<number> {
    const { count } = await this.apiKeyHistoryRepo
      .createQueryBuilder('items')
      .where('time > :from and time < :to', { from, to })
      .groupBy('items.apiId')
      .select('SUM(weight) as count') // change to COUNT(*) to count without weight
      .getRawOne();
    return count;
  }

  /**
   * BONUS: AVG number of requests per specific timeframe
   * @param from date
   * @param to date
   */
  async getAverageRequests(from: Date, to: Date): Promise<number> {
    const requestsQb = await this.apiKeyHistoryRepo
      .createQueryBuilder('items')
      .select('SUM(weight) as count') // change to COUNT(*) to count without weight
      .where('time > :from and time < :to', { from, to })
      .groupBy('items.apiId');

    const { avg } = await this.apiKeyHistoryRepo
      .createQueryBuilder()
      .select('AVG(results.count) as avg')
      .from('(' + requestsQb.getQuery() + ')', 'results')
      .setParameters(requestsQb.getParameters())
      .getRawOne();
    return parseFloat(avg);
  }

  //
  /**
   * Bonus: 3 hour time period for specific api key, when the usage is the highest (Example: 3:00pm to 6:00pm)
   */
  async getRequestsPer3HoursPeriod(): Promise<string> {
    const data = [
      '0 AM - 3 AM',
      '3 AM - 6 AM',
      '6 AM - 9 AM',
      '9 AM - 12 PM',
      '12 PM - 3 PM',
      '3 PM - 6 PM',
      '6 PM - 9 PM',
      '9 PM - 12 AM',
    ];

    const item = await this.apiKeyHistoryRepo
      .createQueryBuilder()
      .select("floor(date_part('hour', time) / 3) as t, count(*)")
      .groupBy('t')
      .orderBy('count', 'DESC')
      .limit(1)
      .getRawOne();

    const { t, count } = item;
    return `${data[parseInt(t)]}: ${count}`;
  }

  // Most used API key (with num of req)
  async getMostUsedApi(): Promise<{ count: number; apiId: number }> {
    const { count, apiId } = await this.apiKeyHistoryRepo
      .createQueryBuilder('items')
      .select('count(*), items.apiId')
      .groupBy('items.apiId')
      .orderBy('count', 'DESC')
      .getRawOne();

    return { count: parseInt(count), apiId: parseInt(apiId) };
  }
}
