// src/metrics/dto/create-utm.dto.ts
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateUtmDto {
  @IsNotEmpty()
  @IsString()
  utm_id: string;

  @IsNotEmpty()
  @IsString()
  shop_name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsUrl()
  url: string;
}
