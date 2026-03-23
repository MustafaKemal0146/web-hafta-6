import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: {
            // Mock PrismaService
            product: {
              findMany: jest.fn().mockResolvedValue([
                { id: 1, name: 'Test Ürün', price: 100, categories: [] },
              ]),
              count: jest.fn().mockResolvedValue(1),
              findUnique: jest.fn().mockResolvedValue({
                id: 1,
                name: 'Test Ürün',
                price: 100,
                categories: [],
              }),
              create: jest.fn().mockResolvedValue({
                id: 2,
                name: 'Yeni Ürün',
                price: 200,
                categories: [],
              }),
              update: jest.fn().mockResolvedValue({
                id: 1,
                name: 'Güncellenmiş Ürün',
                price: 150,
                categories: [],
              }),
              delete: jest.fn().mockResolvedValue({
                id: 1,
                name: 'Silinen Ürün',
                price: 100,
              }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('tanımlanmış olmalı', () => {
    expect(service).toBeDefined();
  });

  it('ürünleri sayfalı şekilde döndürmeli', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
    expect(result.meta.page).toBe(1);
    expect(result.meta.totalPages).toBe(1);
  });

  it('tek ürün döndürmeli', async () => {
    const result = await service.findOne(1);
    expect(result).toBeDefined();
    expect(result.id).toBe(1);
    expect(result.name).toBe('Test Ürün');
  });

  it('yeni ürün oluşturmalı', async () => {
    const dto = { name: 'Yeni Ürün', price: 200 };
    const result = await service.create(dto);
    expect(result.id).toBe(2);
    expect(result.name).toBe('Yeni Ürün');
  });

  it('ürün güncellemeli', async () => {
    const dto = { price: 150 };
    const result = await service.update(1, dto);
    expect(result.price).toBe(150);
  });

  it('ürün silmeli', async () => {
    const result = await service.remove(1);
    expect(result.id).toBe(1);
  });
});
