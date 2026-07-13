import {
  Controller,
  Post,
  Body,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { ProductDTO } from './dto/product.dto';

@Controller('products')
export class ProductsController {

  constructor(private readonly productService: ProductsService) {}
@Post()
 @Post()
create(@Body() createProductDto: any) {
  console.log(createProductDto);
  return createProductDto;
}

}
