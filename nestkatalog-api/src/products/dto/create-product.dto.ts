import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  MaxLength,
  IsArray,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 15 Pro', maxLength: 200 })
  @IsString({ message: 'Ürün adı metin olmalıdır' })
  @MaxLength(200)
  name: string;

  @ApiProperty({ example: 49999.99, minimum: 0 })
  @IsNumber({}, { message: 'Fiyat sayı olmalıdır' })
  @Min(0, { message: 'Fiyat negatif olamaz' })
  price: number;

  @ApiProperty({ example: 'Harika bir akıllı telefon', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 100, required: false, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiProperty({ example: [1, 2], required: false, type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  categoryIds?: number[];
}
