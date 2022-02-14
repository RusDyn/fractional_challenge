import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeyEntity } from '../../model/apiKey.entity';
import { ApiKeyHistoryEntity } from '../../model/apiKeyHistory.entity';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const DbTestingModule = () => [
  TypeOrmModule.forRoot({
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT),
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    type: 'postgres',
    database: 'fr_tests',
    dropSchema: true,
    entities: [ApiKeyEntity, ApiKeyHistoryEntity],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([ApiKeyEntity, ApiKeyHistoryEntity]),
];
