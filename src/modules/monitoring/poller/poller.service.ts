import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';

import { UtmClient } from './utm-client';
import { MetricsService } from '../metrics/metrics.service';

@Injectable()
export class PollerService {
  private readonly logger = new Logger(PollerService.name);
  private utmMissingLogged = false;

  constructor(
    private readonly utmClient: UtmClient,
    private readonly scheduleRegistry: SchedulerRegistry,
    private readonly configService: ConfigService,
    private readonly metricsService: MetricsService,
  ) {
    this.createDynamicCronJob();
  }

  createDynamicCronJob() {
    const interval = this.configService.get<number>('POLLER_INTERVAL', 10);

    const cronExpr = `*/${interval} * * * * *`;

    const job = new CronJob(cronExpr, () => this.createPollAll());
    this.scheduleRegistry.addCronJob('pollAll', job);
    job.start();
    this.logger.log(`Cron started. Interval: ${interval} sec`);
  }

  async createPollAll() {
    this.logger.log('Poller tick');

    const pollStart = Date.now();
    const utms = await this.metricsService.getAllUtms();

    if (utms.length === 0) {
      if (!this.utmMissingLogged) {
        this.logger.warn('No UTM found in database. Polling paused');
        this.utmMissingLogged = true;
      }
      return;
    }

    if (this.utmMissingLogged) {
      this.logger.log(`UTM detected (${utms.length}). Polling resumed`);
      this.utmMissingLogged = false;
    }

    this.logger.log(`Polling ${utms.length} UTM...`);

    await Promise.all(
      utms.map(async (utm) => {
        const start = Date.now();
        try {
          const info = await this.utmClient.getInfo(utm);
          const rsaDays = this.utmClient.calculateDaysLeft(info.rsa.expireDate);
          const gostDays = this.utmClient.calculateDaysLeft(info.gost.expireDate);
          const duration = Date.now() - start;

          this.logger.log(
            `UTM ${utm.utm_id} polled: RSA ${rsaDays} days, GOST ${gostDays} days (took ${duration}ms)`,
          );
        } catch (err: any) {
          this.logger.error(`UTM ${utm.utm_id} poll error: ${err.message}`, err.stack);
        }
      }),
    );

    this.logger.log(`Polling completed for ${utms.length} UTM in ${Date.now() - pollStart}ms`);
  }
}
