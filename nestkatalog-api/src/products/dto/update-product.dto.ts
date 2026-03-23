import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// PartialType: Tüm alanları opsiyonel yapar
// CreateProductDto'yu kopyalamaya gerek yok!
export class UpdateProductDto extends PartialType(CreateProductDto) {}
