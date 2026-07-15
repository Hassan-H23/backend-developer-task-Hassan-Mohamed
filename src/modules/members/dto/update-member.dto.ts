import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';
/**
 * The SubscriptionDate is allowed to be updated in case the admins wants to change members subscription date.
 */
export class UpdateMemberDTO {
  @JoiSchema(Joi.string().optional())
  firstName?: string;

  @JoiSchema(Joi.string().optional())
  lastName?: string;

  @JoiSchema(Joi.string().valid('male', 'female').optional())
  gender?: string;

  @JoiSchema(Joi.date().iso().optional())
  dateOfBirth?: string;

  @JoiSchema(Joi.date().iso().optional())
  subscriptionDate?: string;

  @JoiSchema(Joi.string().optional())
  phone?: string;

  @JoiSchema(Joi.string().uuid().optional().allow(null))
  centralMemberId?: string | null;
}