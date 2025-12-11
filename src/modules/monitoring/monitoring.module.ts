import { Module } from '@nestjs/common';
import { MetricsModule } from 'src/modules/monitoring/metrics/metrics.module';
import { PollerModule } from './poller/poller.module';
import { UtmController } from './api-v1/utm.controller';

@Module({
  imports: [MetricsModule, PollerModule],
  controllers: [UtmController],
  exports: [MetricsModule, PollerModule],
})
export class MonitoringModule {}
