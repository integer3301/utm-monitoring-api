import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MonitoringModule } from './modules/monitoring/monitoring.module';
import { DatabaseModules } from './database/database.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MonitoringModule, DatabaseModules],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
