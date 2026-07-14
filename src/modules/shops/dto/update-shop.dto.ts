import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

const AVAILABILITY = ['busy', 'open', 'closed'];

export class UpdateShopDTO {
  @JoiSchema(Joi.string().trim().min(1).optional())
  name?: string;

  @JoiSchema(Joi.date().iso().optional())
  openingHour?: Date;

  @JoiSchema(Joi.date().iso().optional())
  closingHour?: Date;

  @JoiSchema(Joi.string().valid(...AVAILABILITY).optional())
  availability?: string;
}