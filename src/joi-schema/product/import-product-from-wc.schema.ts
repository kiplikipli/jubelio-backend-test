import Joi from 'joi';
import { EWooCommerceStockStatuses } from '../../enum/woo-commerce/stock-status.enum';

export const ImportProductFromWcSchemaDefinition = () => ({
  sku: Joi.array().items(Joi.string()).allow(null),
  stock_status: Joi.string()
    .valid(...Object.values(EWooCommerceStockStatuses))
    .allow(null),
  count: Joi.number().allow(null),
});

export const ImportProductFromWcSchema = Joi.object(
  ImportProductFromWcSchemaDefinition()
);
