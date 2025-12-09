import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import * as moment from 'moment';


interface UtmInfo {
  shopId: string;
  url: string;
}

@Injectable()
export class UacService {
  private readonly logger = new Logger(UacService.name);
  private utmList: UtmInfo[] = [
    { shopId: '030000549061', url: 'http://10.100.97.211:8080' },
  ];

  private metricsCache: Map<string, { rsaDays: number; getDays: number }> =
    new Map();

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCon() {
    this.logger.log('Запуска опроса всех УТМ....');
  }
  private async fetchUTMInfo(utm: UtmInfo): Promise<void> {
    const infoUrl = `${utm.url}/api/info/list`;
    try {
      const response = await axios.get(infoUrl, { timeout: 10000 }); // Таймаут 10 сек
      const data = response.data;
     const rsaDays = this.calculateDaysLeft(data.rsa.expireDate);
      const gostDays = this.calculateDaysLeft(data.gost.expireDate);
        
      this.metricsCache.set(utm.shopId, { rsaDays, gostDays });
    } 
    catch (error) {
        this.logger.error(`Ошибка опроса ${utm.shopId} (${utm.url}): ${error.message}`);
        this.metricsCache.set(utm.shopId, { rsaDays: -1, gostDays: -1 });
    }

 
}
}
