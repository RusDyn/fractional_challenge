import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as fs from 'fs';

interface CarrierInfo {
  defaultValue?: string;
  values: CarrierInfosValues;
}

export interface NumberResult {
  country: string; // country identifier
  operator: string; // MNO identifier
  countryCallingCode: string; // country dialling code
  nationalNumber: string; // subscriber number
}

type CarrierInfosValues = {
  [code: string]: CarrierInfo;
};

@Injectable()
export class CarriersService implements OnApplicationBootstrap {
  codes: {
    [code: string]: {
      operators: CarrierInfo;
      country: string;
    };
  } = {};
  countryCodes: string[] = [];

  async onApplicationBootstrap(): Promise<void> {
    await this.loadCountries();
    await this.loadCarriers();
  }

  /**
   * Parses MSISDN number and returns result
   * @param number in MSISDN format
   */
  getInfoFromNumber(number: string): NumberResult | undefined {
    if (!number || number.length == 0) {
      return undefined;
    }

    let data: CarrierInfo = undefined;
    let country: string = undefined;
    let countryCallingCode: string = undefined;
    for (const code of this.countryCodes) {
      if (number.startsWith(code)) {
        const item = this.codes[code];
        data = item.operators;
        country = item.country;
        countryCallingCode = code;
        break;
      }
    }

    if (!data) {
      return undefined;
    }

    // we should store last value to return in case of not found letter
    let operator = undefined;
    let numberOffset = countryCallingCode.length;
    if (number.length <= numberOffset) {
      return undefined;
    }
    for (let i = numberOffset; i < number.length; i++) {
      const letter = number[i];
      const { values } = data;

      if (!(letter in values)) {
        break;
      }
      data = values[letter];
      operator = data.defaultValue || operator;
      numberOffset++; // to get national number
    }
    if (!operator) {
      return undefined;
    }

    return {
      country,
      operator,
      countryCallingCode,
      nationalNumber: number.substring(numberOffset),
    };
  }

  private loadCountries() {
    const result = fs.readFileSync('./data/countries.json', 'utf-8');
    const items = JSON.parse(result);
    for (const item of items) {
      const { code, country } = item;
      this.codes[code] = {
        operators: {
          values: {},
        },
        country,
      };
      this.countryCodes.push(code);
    }
  }
  private loadCarriers() {
    const baseDir = './data/carriers';
    const fileNames = fs.readdirSync(baseDir);

    for (const fileName of fileNames) {
      const region = fileName.substring(0, fileName.length - 4); // remove .txt extension
      // read file info and split by lines
      const data = fs.readFileSync(baseDir + '/' + fileName, 'utf-8');
      const lines = data.split(/\r?\n/);
      for (const line of lines) {
        if (line.length == 0 || line.startsWith('#')) {
          continue; // skip comments and empty lines
        }
        const [code, carrier] = line.split('|');

        this.addCarrier(region, code, carrier);
      }
    }
  }

  private addCarrier(region: string, code: string, carrier: string) {
    if (!(region in this.codes)) {
      this.codes[region] = {
        country: undefined,
        operators: {
          values: {},
        },
      };
    }
    let data: CarrierInfo = this.codes[region].operators;

    const lastIndex = code.length - 1;
    const start = region.length; // skip region from the code
    for (let i = start; i < lastIndex; i++) {
      const letter = code[i];
      const { values } = data;
      if (!(letter in values)) {
        values[letter] = { values: {} };
      }
      data = values[letter];
    }

    // last letter is a special case
    const { values } = data;
    const lastLetter = code[lastIndex];
    if (!(lastLetter in values)) {
      values[lastLetter] = { defaultValue: carrier, values: {} };
    } else {
      values[lastLetter].defaultValue = carrier;
    }
  }
}
