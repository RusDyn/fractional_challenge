import { Injectable } from '@nestjs/common';
import { CarriersService } from './carriers/carriers.service';

@Injectable()
export class AppService {
  constructor(private readonly carriersService: CarriersService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getInfo(phoneNumber: string) {
    if (!phoneNumber || phoneNumber.length == 0 || phoneNumber.length > 15) {
      throw new Error('WRONG_NUMBER_FORMAT'); // wrong size
    }
    if (/^[0-9]*$/.test(phoneNumber) === false) {
      throw new Error('WRONG_NUMBER_FORMAT'); // only digits
    }
    const result = this.carriersService.getInfoFromNumber(phoneNumber);
    if (!result) {
      throw new Error('WRONG_NUMBER_FORMAT');
    }
    return result;
  }
}
