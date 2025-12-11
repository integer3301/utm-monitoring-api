import { Module } from '@nestjs/common';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';

import { MetricsModule } from 'src/modules/monitoring/metrics/metrics.module';
import { UtmClient } from './utm-client';
import { PollerService } from './poller.service';

@Module({
  imports: [ScheduleModule.forRoot(), MetricsModule],
  providers: [PollerService, UtmClient, SchedulerRegistry],
  exports: [PollerService],
})
export class PollerModule {}
