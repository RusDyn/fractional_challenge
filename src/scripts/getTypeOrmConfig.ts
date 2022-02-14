import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import * as path from 'path';

export function getTypeOrmConfig(): TypeOrmModuleOptions {
  const extension = path.extname(__filename);
  const isTypescript = extension === '.ts';

  const baseFolder = isTypescript ? 'src/' : 'dist/';
  const ext = isTypescript ? '.ts' : '.js';
  const entities = [`${baseFolder}model/*${ext}`];
  const migrations = [`migration/*.${ext}`];

  const params: TypeOrmModuleOptions = {
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT),
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    entities,
    migrations,
    cli: {
      migrationsDir: 'migration',
    },
    ssl: false,
    type: 'postgres',
    migrationsTableName: 'migration',
  };

  return params;
}
