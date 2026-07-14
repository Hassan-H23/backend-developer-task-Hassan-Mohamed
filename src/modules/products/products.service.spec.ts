import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { ShopsRepository } from '../shops/shops.repository';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let productsRepository: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    findWithFilter: jest.Mock;
    findByShopIdAndName: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
  let shopsRepository: {
    findOne: jest.Mock;
  };

  beforeEach(async () => {
    productsRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      findWithFilter: jest.fn(),
      findByShopIdAndName: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    shopsRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: productsRepository,
        },
        {
          provide: ShopsRepository,
          useValue: shopsRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  describe('create', () => {
    it('creates a product when the shop exists', async () => {
      const dto: CreateProductDTO = {
        shopId: 'shop-id',
        name: 'Apple Juice',
        description: 'Fresh juice bottle',
        price: 50,
        stockCount: 10,
      };

      const createdProduct = {
        id: 'product-id',
        ...dto,
      };

      shopsRepository.findOne.mockResolvedValue({ id: 'shop-id' });
      productsRepository.findByShopIdAndName.mockResolvedValue(null);
      productsRepository.create.mockResolvedValue(createdProduct);

      const result = await service.create(dto);

      expect(shopsRepository.findOne).toHaveBeenCalledWith(dto.shopId);
      expect(productsRepository.findByShopIdAndName).toHaveBeenCalledWith(
        dto.shopId,
        dto.name,
      );
      expect(productsRepository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(createdProduct);
    });

    it('throws when the shop does not exist', async () => {
      const dto: CreateProductDTO = {
        shopId: 'missing-shop-id',
        name: 'Apple Juice',
        description: 'Fresh juice bottle',
        price: 50,
        stockCount: 10,
      };

      shopsRepository.findOne.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      expect(productsRepository.create).not.toHaveBeenCalled();
    });

    it('throws when a product with the same name already exists in the same shop', async () => {
      const dto: CreateProductDTO = {
        shopId: 'shop-id',
        name: 'Apple Juice',
        description: 'Fresh juice bottle',
        price: 50,
        stockCount: 10,
      };

      shopsRepository.findOne.mockResolvedValue({ id: 'shop-id' });
      productsRepository.findByShopIdAndName.mockResolvedValue({
        id: 'existing-product-id',
        ...dto,
      });

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      expect(productsRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('returns all products when no search is provided', async () => {
      const products = [{ id: '1' }, { id: '2' }];
      productsRepository.findAll.mockResolvedValue(products);

      const result = await service.findAll();

      expect(productsRepository.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(products);
    });

    it('returns filtered products when search is provided', async () => {
      const products = [{ id: '1', name: 'Apple Juice' }];
      productsRepository.findAll.mockResolvedValue(products);

      const result = await service.findAll('app');

      expect(productsRepository.findAll).toHaveBeenCalledWith('app');
      expect(result).toEqual(products);
    });
  });

  describe('findOne', () => {
    it('returns a product when found', async () => {
      const product = { id: 'product-id' };
      productsRepository.findOne.mockResolvedValue(product);

      const result = await service.findOne('product-id');

      expect(result).toEqual(product);
    });

    it('throws when product does not exist', async () => {
      productsRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('updates a product successfully', async () => {
      const dto: UpdateProductDTO = {
        name: 'Apple Juice Large',
        price: 60,
        stockCount: 15,
      };

      const existingProduct = {
        id: 'product-id',
        shopId: 'shop-id',
        name: 'Apple Juice',
        description: 'Fresh juice bottle',
        price: 50,
        stockCount: 10,
      };

      const updatedProduct = {
        ...existingProduct,
        ...dto,
      };

      productsRepository.findOne.mockResolvedValue(existingProduct);
      productsRepository.update.mockResolvedValue(updatedProduct);

      const result = await service.update('product-id', dto);

      expect(productsRepository.update).toHaveBeenCalledWith('product-id', dto);
      expect(result).toEqual(updatedProduct);
    });

    it('throws when product does not exist', async () => {
      productsRepository.findOne.mockResolvedValue(null);

      await expect(service.update('missing-id', { price: 60 })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws on empty update body', async () => {
      productsRepository.findOne.mockResolvedValue({ id: 'product-id' });

      await expect(service.update('product-id', {})).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws when stockCount is invalid', async () => {
      productsRepository.findOne.mockResolvedValue({ id: 'product-id' });

      await expect(
        service.update('product-id', { stockCount: 0 }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('deletes a product successfully', async () => {
      productsRepository.findOne.mockResolvedValue({ id: 'product-id' });
      productsRepository.delete.mockResolvedValue(undefined);

      await service.delete('product-id');

      expect(productsRepository.delete).toHaveBeenCalledWith('product-id');
    });

    it('throws when product does not exist', async () => {
      productsRepository.findOne.mockResolvedValue(null);

      await expect(service.delete('missing-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(productsRepository.delete).not.toHaveBeenCalled();
    });
  });
});