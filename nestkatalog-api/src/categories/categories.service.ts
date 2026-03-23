import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          include: { categories: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`${id} ID'li kategori bulunamadı`);
    }

    return category;
  }

  async create(dto: CreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException('Bu kategori adı zaten mevcut');
    }

    return this.prisma.category.create({
      data: { name: dto.name },
    });
  }
}
