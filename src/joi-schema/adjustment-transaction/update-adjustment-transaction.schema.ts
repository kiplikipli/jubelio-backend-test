import Joi from 'joi';

export const UpdateAdjustmentTransactionSchemaDefinition = () => ({
  productId: Joi.number().required(),
  qty: Joi.number().required(),
});

export const UpdateAdjustmentTransactionSchema = Joi.object(
  UpdateAdjustmentTransactionSchemaDefinition()
);
