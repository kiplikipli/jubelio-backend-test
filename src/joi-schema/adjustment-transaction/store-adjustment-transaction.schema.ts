import Joi from 'joi';

export const StoreAdjustmentTransactionSchemaDefinition = () => ({
  productId: Joi.number().required(),
  qty: Joi.number().required(),
});

export const StoreAdjustmentTransactionSchema = Joi.object(
  StoreAdjustmentTransactionSchemaDefinition()
);
