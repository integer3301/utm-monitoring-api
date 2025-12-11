import { Module } from '@nestjs/common';

import { UTMRepository } from './utm.repository';
import { MetricsRepository } from './metrics.repository';
import { MetricsService } from './metrics.service';

@Module({
  providers: [UTMRepository, MetricsRepository, MetricsService],
  exports: [MetricsService, UTMRepository, MetricsRepository],
})
export class MetricsModule {}
