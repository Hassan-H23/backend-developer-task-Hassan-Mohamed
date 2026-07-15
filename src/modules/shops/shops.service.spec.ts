import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ShopsService } from './shops.service';
import { ShopsRepository } from './shops.repository';
import { ProductsService } from '../products/products.service';
import { CreateShopDTO } from './dto/create-shop.dto';
import { UpdateShopDTO } from './dto/update-shop.dto';

describe('ShopsService', () => {
  let service: ShopsService;
  let repository: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
  let productsService: {
    findAll: jest.Mock;
    findWithFilter: jest.Mock;
  };

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    productsService = {
      findAll: jest.fn(),
      findWithFilter: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShopsService,
        {
          provide: ShopsRepository,
          useValue: repository,
        },
        {
          provide: ProductsService,
          useValue: productsService,
        },
      ],
    }).compile();

    service = module.get<ShopsService>(ShopsService);
  });

  describe('create', () => {
    it('creates a shop when hours are valid', async () => {
      const dto: CreateShopDTO = {
        name: 'Main Shop',
        openingHour: new Date('2026-07-15T09:00:00.000Z'),
        closingHour: new Date('2026-07-15T18:00:00.000Z'),
        availability: 'open',
      };

      const createdShop = {
        id: 'shop-id',
        ...dto,
      };

      repository.create.mockResolvedValue(createdShop);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(createdShop);
    });

    it('throws when closingHour is not after openingHour', async () => {
      const dto: CreateShopDTO = {
        name: 'Main Shop',
        openingHour: new Date('2026-07-15T18:00:00.000Z'),
        closingHour: new Date('2026-07-15T09:00:00.000Z'),
        availability: 'open',
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('returns all shops', async () => {
      const shops = [{ id: '1' }, { id: '2' }];
      repository.findAll.mockResolvedValue(shops);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual(shops);
    });
  });

  describe('findAllWithProducts', () => {
    it('returns shops with grouped products', async () => {
      const shops = [
        { id: 'shop-1', name: 'Shop 1' },
        { id: 'shop-2', name: 'Shop 2' },
      ];

      const products = [
        { id: 'product-1', shopId: 'shop-1', name: 'Apple Juice' },
        { id: 'product-2', shopId: 'shop-1', name: 'Orange Juice' },
        { id: 'product-3', shopId: 'shop-2', name: 'Water' },
      ];

      repository.findAll.mockResolvedValue(shops);
      productsService.findAll.mockResolvedValue(products);

      const result = await service.findAllWithProducts();

      expect(repository.findAll).toHaveBeenCalled();
      expect(productsService.findAll).toHaveBeenCalled();
      expect(result).toEqual([
        {
          ...shops[0],
          products: [products[0], products[1]],
        },
        {
          ...shops[1],
          products: [products[2]],
        },
      ]);
    });

    it('returns empty product arrays when a shop has no products', async () => {
      const shops = [{ id: 'shop-1', name: 'Shop 1' }];
      repository.findAll.mockResolvedValue(shops);
      productsService.findAll.mockResolvedValue([]);

      const result = await service.findAllWithProducts();

      expect(result).toEqual([
        {
          ...shops[0],
          products: [],
        },
      ]);
    });
  });

  describe('findOne', () => {
    it('returns a shop when found', async () => {
      const shop = { id: 'shop-id' };
      repository.findOne.mockResolvedValue(shop);

      const result = await service.findOne('shop-id');

      expect(result).toEqual(shop);
    });

    it('throws when shop does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('updates a shop successfully', async () => {
      const dto: UpdateShopDTO = {
        availability: 'busy',
      };

      const existingShop = {
        id: 'shop-id',
        openingHour: new Date('2026-07-15T09:00:00.000Z'),
        closingHour: new Date('2026-07-15T18:00:00.000Z'),
      };

      const updatedShop = {
        ...existingShop,
        ...dto,
      };

      repository.findOne.mockResolvedValue(existingShop);
      repository.update.mockResolvedValue(updatedShop);

      const result = await service.update('shop-id', dto);

      expect(repository.update).toHaveBeenCalledWith('shop-id', dto);
      expect(result).toEqual(updatedShop);
    });

    it('throws when shop does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.update('missing-id', { availability: 'busy' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws on empty update body', async () => {
      repository.findOne.mockResolvedValue({
        id: 'shop-id',
        openingHour: new Date('2026-07-15T09:00:00.000Z'),
        closingHour: new Date('2026-07-15T18:00:00.000Z'),
      });

      await expect(service.update('shop-id', {})).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws when closingHour is not after openingHour during update', async () => {
      repository.findOne.mockResolvedValue({
        id: 'shop-id',
        openingHour: new Date('2026-07-15T09:00:00.000Z'),
        closingHour: new Date('2026-07-15T18:00:00.000Z'),
      });

      await expect(
        service.update('shop-id', {
          openingHour: new Date('2026-07-15T20:00:00.000Z'),
          closingHour: new Date('2026-07-15T10:00:00.000Z'),
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('deletes a shop successfully when it has no products', async () => {
      repository.findOne.mockResolvedValue({ id: 'shop-id' });
      productsService.findWithFilter.mockResolvedValue([]);
      repository.delete.mockResolvedValue(undefined);

      await service.delete('shop-id');

      expect(productsService.findWithFilter).toHaveBeenCalledWith({
        shopId: 'shop-id',
      });
      expect(repository.delete).toHaveBeenCalledWith('shop-id');
    });

    it('throws when shop does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.delete('missing-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.delete).not.toHaveBeenCalled();
    });

    it('throws when shop still has products', async () => {
      repository.findOne.mockResolvedValue({ id: 'shop-id' });
      productsService.findWithFilter.mockResolvedValue([
        { id: 'product-1', shopId: 'shop-id' },
      ]);

      await expect(service.delete('shop-id')).rejects.toThrow(
        ConflictException,
      );
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});