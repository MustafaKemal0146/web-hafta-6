import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Geçerli bir email adresi giriniz' })
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır' })
  password: string;

  @ApiProperty({ example: 'Ahmet Yılmaz' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'user', required: false, enum: ['user', 'admin'] })
  @IsOptional()
  @IsString()
  role?: string;
}
