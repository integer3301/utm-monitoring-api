import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import moment from 'moment';

interface UTMInfo {
  shopId: string;
  url: string;
}
interface CertificateInfo {
  certType: string;
  startDate: string;
  expireDate: string;
  isValid: string;
  issuer: string;
}

interface UTMApiResponse {
  ownerId: string;
  rsa: CertificateInfo;
  gost: CertificateInfo;
  version: string;
  contour: string;
  rsaError: string | null;
  checkInfo: string;
  db: { createDate: string; ownerId: string };
  license: boolean;
}

@Injectable()
export class UacService {
  private readonly logger = new Logger(UacService.name);

  private utmList: UTMInfo[] = [{ shopId: '030000549061', url: 'http://localhost:4000' }];

  private metricsCache: Map<string, { rsaDays: number; gostDays: number }> = new Map();

  /**
   * CRON: every_5_minutes
   */

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCon() {
    this.logger.log('Запуска опроса всех УТМ....');

    await Promise.all(this.utmList.map((utm) => this.fetchUTMInfo(utm)));

    this.logger.log('Опрос завершён');
  }

  private async fetchUTMInfo(utm: UTMInfo): Promise<void> {
    const infoUrl = `${utm.url}/info`;
    try {
      const response = await axios.get<UTMApiResponse[]>(infoUrl, { timeout: 10000 });

      const data = response.data[0];
      const rsaDays = this.calculateDaysLeft(data.rsa.expireDate);
      const gostDays = this.calculateDaysLeft(data.gost.expireDate);

      this.metricsCache.set(utm.shopId, { rsaDays, gostDays });

      this.logger.log(`УТМ ${utm.shopId}: RSA ${rsaDays} дн., ГОСТ ${gostDays} дн.`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Неизвестная ошибка';
      this.logger.error(`Ошибка опроса ${utm.shopId} (${utm.url}): ${msg}`);
      this.metricsCache.set(utm.shopId, { rsaDays: -1, gostDays: -1 });
    }
  }

  private calculateDaysLeft(dateString: string): number {
    if (!dateString) return -1;

    const expireDate = moment(dateString, 'YYYY-MM-DD HH:mm:ss Z', true);
    if (!expireDate.isValid()) return -1;

    return expireDate.diff(moment(), 'days');
  }

  public getMetricsByShopId(shopId: string) {
    return this.metricsCache.get(shopId) || { rsaDays: -1, gostDays: -1 };
  }
  public getAllMetrics() {
    return Array.from(this.metricsCache.entries()).map(([shopId, data]) => ({
      shopId,
      ...data,
    }));
  }
}
