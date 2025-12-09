import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UacModule } from './uac/uac.module';

@Module({
  imports: [UacModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
