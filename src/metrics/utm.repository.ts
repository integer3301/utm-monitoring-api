import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UTMRepository {
  constructor(private readonly db: DatabaseService) {}

  async getAll() {
    return await this.db.query(`SELECT * FROM utms ORDER By shop_name`);
  }
  async getById(utm_id: string) {
    const rows = await this.db.query(`SELECT * FROM utms WHERE utm_id=$1`, [utm_id]);
    return rows[0];
  }
  async create(utm_id: string, shop_name: string, address: string, url: string) {
    return this.db.query(
      `INSERT INTRO utms(utm_id, shop_name. address, url) VALUES($1, $2,$3, $4) RETURNING *`,
      [utm_id, shop_name, address, url],
    );
  }
}
