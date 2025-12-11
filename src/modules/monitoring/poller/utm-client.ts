import { Injectable } from '@nestjs/common';
import axios from 'axios';
import moment from 'moment';
import { UTMApiResponse, UTMInfo } from 'src/shared/types/utm';

@Injectable()
export class UtmClient {
  async getInfo(utm: UTMInfo): Promise<UTMApiResponse> {
    const res = await axios.get<UTMApiResponse[]>(`${utm.url}/info`, {
      timeout: 10000,
    });
    return res.data[0];
  }

  calculateDaysLeft(dateString: string): number {
    if (!dateString) return -1;
    const expireDate = moment(dateString, 'YYYY-MM-DD HH:mm:ss Z', true);
    if (!expireDate.isValid()) return -1;
    return expireDate.diff(moment(), 'days');
  }
}
