import { Controller, Get, Param } from '@nestjs/common';
import { MetricsService } from 'src/modules/monitoring/metrics/metrics.service';

@Controller('utms')
export class UtmController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  async getAll() {
    return this.metricsService.getAllUtms();
  }

  @Get(':utm_id')
  async getById(@Param('utm_id') utm_id: string) {
    return this.metricsService.getUtmById(utm_id);
  }
}
