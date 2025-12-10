import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PollerService {
  private readonly logger = new Logger(PollerService.name);

  constructor(private readonly configService: ConfigService) {}

  @Cron(`*/${new ConfigService().get<number>('POLLER_INTERVAL', 10)} * * * * *`)
  async pollAll() {}
}
