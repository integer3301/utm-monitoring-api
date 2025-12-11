import { Injectable } from '@nestjs/common';
import { UTMRepository } from './utm.repository';
import { MetricsRepository } from './metrics.repository';
import { CreateUtmDto } from './dto/create-utm.dto';
import { UpdateUtmDto } from './dto/update-utm.dto';

@Injectable()
export class MetricsService {
  constructor(
    private readonly utmRepo: UTMRepository,
    private readonly metricsRepo: MetricsRepository,
  ) {}

  // Методы UTM
  async createUtm(dto: CreateUtmDto) {
    return this.utmRepo.create(dto);
  }

  async updateUtm(utm_id: string, dto: UpdateUtmDto) {
    return this.utmRepo.update(utm_id, dto);
  }

  async deleteUtm(utm_id: string) {
    return this.utmRepo.delete(utm_id);
  }

  async getAllUtms() {
    return this.utmRepo.getAll();
  }

  async getUtmById(utm_id: string) {
    return this.utmRepo.getById(utm_id);
  }

  async saveMetric(data: {
    utm_id: string;
    shop_name: string;
    description?: string;
    version: string;
    rsa_days: number;
    gost_days: number;
    doc_buffer?: Date;
  }) {
    return this.metricsRepo.save(data);
  }

  async findLatestMetric(utm_id: string) {
    return this.metricsRepo.findLatest(utm_id);
  }
}
