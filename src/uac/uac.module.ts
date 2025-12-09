import { Module } from '@nestjs/common';
import { UacService } from './uac.service';

@Module({
  providers: [UacService],
})
export class UacModule {}
