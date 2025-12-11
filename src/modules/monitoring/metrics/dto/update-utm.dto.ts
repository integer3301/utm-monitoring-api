import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateUtmDto {
  @IsOptional()
  @IsString()
  shop_name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsUrl()
  url?: string;
}
