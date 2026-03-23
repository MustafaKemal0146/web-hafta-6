import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Tüm kategoriler' })
  @ApiResponse({ status: 200, description: 'Kategori listesi' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Kategorideki ürünler' })
  @ApiResponse({ status: 200, description: 'Kategori + ürünleri' })
  @ApiResponse({ status: 404, description: 'Kategori bulunamadı' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yeni kategori oluştur (Sadece Admin)' })
  @ApiResponse({ status: 201, description: 'Kategori oluşturuldu' })
  @ApiResponse({ status: 403, description: 'Admin yetkisi gerekli' })
  @ApiResponse({ status: 409, description: 'Kategori adı zaten mevcut' })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }
}
