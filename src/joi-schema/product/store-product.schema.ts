import Joi from 'joi';

export const StoreProductSchemaDefinition = () => ({
  name: Joi.string().required(),
  sku: Joi.string().required(),
  image: Joi.string().required(),
  price: Joi.number().min(1).required(),
  description: Joi.string().allow(null, ''),
  stock: Joi.number().min(0).default(0),
});

export const StoreProductSchema = Joi.object(StoreProductSchemaDefinition());
