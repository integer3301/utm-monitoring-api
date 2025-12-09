import { Module } from '@nestjs/common';
import { UacService } from './uac.service';
import { UacController } from './uac.controller';

@Module({
  providers: [UacService],
  controllers: [UacController],
})
export class UacModule {}
