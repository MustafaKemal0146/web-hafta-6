import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: number;
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const { search, categoryId } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categories = {
        some: { id: Number(categoryId) },
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: { categories: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { categories: true },
    });

    if (!product) {
      throw new NotFoundException(`${id} ID'li ürün bulunamadı`);
    }

    return product;
  }

  async create(dto: CreateProductDto) {
    const { categoryIds, ...rest } = dto;

    return this.prisma.product.create({
      data: {
        ...rest,
        categories: categoryIds
          ? {
              connect: categoryIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: { categories: true },
    });
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id);

    const { categoryIds, ...rest } = dto;

    return this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        categories: categoryIds
          ? {
              set: categoryIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: { categories: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.product.delete({
      where: { id },
    });
  }

  async updateImage(id: number, filename: string) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: { imageUrl: `uploads/${filename}` },
    });
  }
}
