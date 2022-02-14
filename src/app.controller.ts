import {
  Controller,
  Get,
  Param,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { RateLimitGuard, SetApiWeight } from './guards/RateLimitGuard';
import { BackExceptionFilter } from './BackExceptionFilter';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @SetApiWeight(100) // don't ask for a hello too often :)
  @UseFilters(BackExceptionFilter)
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('phone')
  @UseGuards(RateLimitGuard)
  @SetApiWeight(1)
  @UseFilters(BackExceptionFilter)
  getInfo(@Query('number') phoneNumber: string): any {
    return this.appService.getInfo(phoneNumber);
  }
}
