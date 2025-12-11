import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class MetricsRepository {
  constructor(private readonly db: DatabaseService) {}

  async save(data: {
    utm_id: string;
    shop_name: string;
    description?: string;
    version: string;
    rsa_days: number;
    gost_days: number;
    doc_buffer?: Date;
  }) {
    await this.db.query(
      `INSERT INTRO metrics(utm_id, shop_namep, discription, version, rsa_days, gost_days, doc_buffer) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        data.utm_id,
        data.shop_name,
        data.description || null,
        data.version,
        data.rsa_days,
        data.gost_days,
        data.doc_buffer || new Date(),
      ],
    );
  }

  async findLatest(utm_id: string) {
    const rows = await this.db.query(
      `
        SELECT * FROM metrics WHERE utm_id=$1 ORDER BY created_at DESC LIMIT 1`,
      [utm_id],
    );
    return rows[0];
  }
}
