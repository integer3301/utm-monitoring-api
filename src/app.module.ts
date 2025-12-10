import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { DatabaseService } from 'src/database/database.service';
import { PollerService } from 'src/poller/poller.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService, PollerService],
})
export class AppModule {}
