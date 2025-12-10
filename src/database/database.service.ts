import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private pool: Pool;
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const dbConfig = {
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      user: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASS'),
      database: this.configService.get<string>('DB_NAME'),
    };

    this.pool = new Pool(dbConfig);

    try {
      await this.pool.query('SELECT 1');
      this.logger.log(`PostgreSQL connected at ${dbConfig.host}:${dbConfig.port}`);
    } catch (error: any) {
      this.logger.error(`Failed to connect to PostgreSQL: ${error.message}`);
      process.exit(1);
    }
  }

  async query(queryText: string, params?: any[]) {
    const client = await this.pool.connect();
    try {
      const res = await client.query(queryText, params);
      return res.rows;
    } finally {
      client.release();
    }
  }
}
