import Joi from 'joi';

export const UpdateProductSchemaDefinition = () => ({
  name: Joi.string().required(),
  sku: Joi.string().required(),
  image: Joi.string().required(),
  price: Joi.number().min(1).required(),
  description: Joi.string().allow(null),
});

export const UpdateProductSchema = Joi.object(UpdateProductSchemaDefinition());
