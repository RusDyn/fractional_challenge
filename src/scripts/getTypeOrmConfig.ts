import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export function getTypeOrmConfig(): TypeOrmModuleOptions {
  const entities = [`model/*.ts`];
  const migrations = [`migration/*.ts`];

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
