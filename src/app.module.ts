import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarriersService } from './carriers/carriers.service';
import { getTypeOrmConfig } from './scripts/getTypeOrmConfig';
import { ApiKeyEntity } from './model/apiKey.entity';
import { ApiKeyHistoryEntity } from './model/apiKeyHistory.entity';
import { DbService } from './db/db.service';
import { RateLimitGuard } from './guards/RateLimitGuard';
import { APP_GUARD } from '@nestjs/core';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forRoot(getTypeOrmConfig()),
    TypeOrmModule.forFeature([ApiKeyEntity, ApiKeyHistoryEntity]),
  ],
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
})
export class AppModule {}
