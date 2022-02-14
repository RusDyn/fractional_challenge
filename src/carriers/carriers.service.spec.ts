import { Test, TestingModule } from '@nestjs/testing';
import { CarriersService } from './carriers.service';

describe('CarriersService', () => {
  let carriersService: CarriersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarriersService],
    }).compile();

    const app = module.createNestApplication();
    await app.init();
    carriersService = app.get<CarriersService>(CarriersService);
  });

  describe('test carriers results', () => {
    it('no region', () => {
      let carrier = carriersService.getInfoFromNumber('700123456');
      expect(carrier).toBeUndefined();

      carrier = carriersService.getInfoFromNumber('700123456');
      expect(carrier).toBeUndefined();
    });

    it('wrong region', () => {
      let carrier = carriersService.getInfoFromNumber('700123456');
      expect(carrier).toBeUndefined();

      carrier = carriersService.getInfoFromNumber('700123456');
      expect(carrier).toBeUndefined();
    });

    it('wrong number', () => {
      const carrier = carriersService.getInfoFromNumber('1');
      expect(carrier).toBeUndefined();
    });

    it('basic carriers', () => {
      let carrier = carriersService.getInfoFromNumber('7700123456');
      expect(carrier).toStrictEqual({
        country: 'RU',
        countryCallingCode: '7',
        nationalNumber: '123456',
        operator: 'Altel',
      });

      carrier = carriersService.getInfoFromNumber('77770002');
      expect(carrier).toStrictEqual({
        country: 'RU',
        countryCallingCode: '7',
        nationalNumber: '0002',
        operator: 'Beeline',
      });

      carrier = carriersService.getInfoFromNumber('79000');
      expect(carrier).toStrictEqual({
        country: 'RU',
        countryCallingCode: '7',
        nationalNumber: '',
        operator: 'Tele2',
      });

      carrier = carriersService.getInfoFromNumber('790000000');
      expect(carrier).toStrictEqual({
        country: 'RU',
        countryCallingCode: '7',
        nationalNumber: '0000',
        operator: 'Tele2',
      });

      carrier = carriersService.getInfoFromNumber('790003');
      expect(carrier).toStrictEqual({
        country: 'RU',
        countryCallingCode: '7',
        nationalNumber: '',
        operator: 'Motiv',
      });
    });

    it('2x code test', () => {
      const carrier = carriersService.getInfoFromNumber('20101234123');
      expect(carrier).toStrictEqual({
        country: 'EG',
        countryCallingCode: '20',
        nationalNumber: '1234123',
        operator: 'Vodafone',
      });
    });
    it('2nd level default value test', () => {
      const carrier = carriersService.getInfoFromNumber('7900196');
      expect(carrier).toStrictEqual({
        country: 'RU',
        countryCallingCode: '7',
        nationalNumber: '6',
        operator: 'Tele2',
      });
    });
  });
});
