import { getConnection } from 'typeorm';
import { ApiKeyEntity } from '../../model/apiKey.entity';
import { ApiKeyHistoryEntity } from '../../model/apiKeyHistory.entity';

export const initTestDataset = async () => {
  const connection = await getConnection();
  const entityManager = connection.createEntityManager();

  await entityManager.insert(ApiKeyEntity, {
    key: '123',
  });
  await entityManager.insert(ApiKeyEntity, {
    key: '456',
  });
  await entityManager.insert(ApiKeyHistoryEntity, {
    weight: 1,
    message: 'test message 1',
    apiId: 1,
  });

  await entityManager.insert(ApiKeyHistoryEntity, {
    weight: 1,
    message: 'test message 2',
    apiId: 1,
  });

  await entityManager.insert(ApiKeyHistoryEntity, {
    weight: 1,
    message: 'test message 3',
    apiId: 1,
  });

  await entityManager.insert(ApiKeyHistoryEntity, {
    weight: 1,
    message: 'test message 4',
    apiId: 1,
  });

  await entityManager.insert(ApiKeyHistoryEntity, {
    weight: 1,
    message: 'test message 2',
    apiId: 2,
    time: new Date('2014-01-01T17:00:00Z'),
  });

  await entityManager.insert(ApiKeyHistoryEntity, {
    weight: 1,
    message: 'test message 2',
    apiId: 2,
    time: new Date('2014-01-01T11:00:00Z'),
  });

  await entityManager.insert(ApiKeyHistoryEntity, {
    weight: 1,
    message: 'test message 2',
    apiId: 2,
  });
};
