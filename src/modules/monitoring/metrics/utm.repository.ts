import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUtmDto } from './dto/create-utm.dto';
import { UpdateUtmDto } from './dto/update-utm.dto';

@Injectable()
export class UTMRepository {
  constructor(private readonly db: DatabaseService) {}

  private async execute<T>(queryFn: () => Promise<T>, errorMessage: string): Promise<T> {
    try {
      return await queryFn();
    } catch (err: any) {
      throw new BadRequestException(
        err.code === '23505' ? `UTM already exists` : err.message || errorMessage,
      );
    }
  }

  async create(dto: CreateUtmDto) {
    return this.execute(async () => {
      const result = await this.db.query(
        `INSERT INTO utms(utm_id, shop_name, address, url) 
         VALUES($1, $2, $3, $4) RETURNING *`,
        [dto.utm_id, dto.shop_name, dto.address, dto.url],
      );
      return result[0];
    }, 'Failed to create UTM');
  }

  async update(utm_id: string, dto: UpdateUtmDto) {
    return this.execute(async () => {
      const { shop_name, address, url } = dto;
      const fields: string[] = [];
      const values: any[] = [utm_id];
      let index = 2;

      if (shop_name !== undefined) {
        fields.push(`shop_name=$${index++}`);
        values.push(shop_name);
      }
      if (address !== undefined) {
        fields.push(`address=$${index++}`);
        values.push(address);
      }
      if (url !== undefined) {
        fields.push(`url=$${index++}`);
        values.push(url);
      }

      if (fields.length === 0) {
        throw new BadRequestException('No fields to update');
      }

      const sql = `UPDATE utms SET ${fields.join(', ')} WHERE utm_id=$1 RETURNING *`;
      const result = await this.db.query(sql, values);

      if (!result || result.length === 0) {
        throw new NotFoundException(`UTM with id "${utm_id}" not found`);
      }

      return result[0];
    }, 'Failed to update UTM');
  }

  async delete(utm_id: string) {
    return this.execute(async () => {
      const result = await this.db.query(`DELETE FROM utms WHERE utm_id=$1 RETURNING *`, [utm_id]);

      if (!result || result.length === 0) {
        throw new NotFoundException(`UTM with id "${utm_id}" not found`);
      }

      return result[0];
    }, 'Failed to delete UTM');
  }

  async getAll() {
    return this.execute(async () => {
      return this.db.query(`SELECT * FROM utms ORDER BY shop_name`);
    }, 'Failed to fetch UTMs');
  }

  async getById(utm_id: string) {
    return this.execute(async () => {
      const rows = await this.db.query(`SELECT * FROM utms WHERE utm_id=$1`, [utm_id]);
      if (!rows || rows.length === 0) {
        throw new NotFoundException(`UTM with id "${utm_id}" not found`);
      }
      return rows[0];
    }, 'Failed to fetch UTM');
  }
}
