import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

export class CreateProductDTO {
  @JoiSchema(Joi.string().uuid().required()) //Validation for ShopID I am assuming that the shopId is a UUID
  shopId: string;

  @JoiSchema(Joi.string().trim().min(1).required()) //Validation for Product Name
  name: string;

  @JoiSchema(Joi.string().trim().min(1).required()) //Validation for Product Description I am assuming that the description is a required field and should be a non-empty string. 
  description: string;

  @JoiSchema(Joi.number().positive().min(1).required()) //Validation for Product Price I am assuming that the price cannot be 0.
  price: number;

  @JoiSchema(Joi.number().integer().positive().min(1).required()) //Validation for Product Stock Count
  stockCount: number;
}


