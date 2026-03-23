import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Elektronik' })
  @IsString({ message: 'Kategori adı metin olmalıdır' })
  @MaxLength(100)
  name: string;
}
