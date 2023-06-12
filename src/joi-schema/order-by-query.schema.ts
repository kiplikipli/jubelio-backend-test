import Joi from 'joi';
import { EOrderByMethod } from '../enum/order-by-method.enum';
import { TOrderBy } from '../types/common/order-by.type';

export const OrderByQuerySchemaDefinition = (orderableFields: string[]) => ({
  orderByField: Joi.string().valid(...orderableFields, null),
  orderByMethod: Joi.string()
    .valid(...Object.values(EOrderByMethod))
    .default(EOrderByMethod.ASCENDING),
});

export const OrderByQuerySchema = Joi.object<TOrderBy>(
  OrderByQuerySchemaDefinition([])
);
