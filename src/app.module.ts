import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UacModule } from './uac/uac.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(), // 🔹 нужно, чтобы cron работал
    UacModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
