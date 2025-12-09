import { Controller, Get, Param } from '@nestjs/common';
import { UacService } from './uac.service';

@Controller('uac')
export class UacController {
  constructor(private readonly uacService: UacService) {}

  @Get('metrics')
  getAllMetrics() {
    return this.uacService.getAllMetrics();
  }
  @Get('metrics/:shopId')
  getMetricsByShopId(@Param('shopId') shopId: string) {
    return this.uacService.getMetricsByShopId(shopId);
  }
}
