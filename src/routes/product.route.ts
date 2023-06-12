import { ServerRoute } from '@hapi/hapi';
import {
  DELETE_METHOD,
  GET_METHOD,
  ORDERABLE_PRODUCT_FIELDS,
  PATCH_METHOD,
  POST_METHOD,
} from '../constants';
import {
  deleteExistingProduct,
  getProductDetail,
  getProducts,
  importProducts,
  storeNewProduct,
  updateExistingProduct,
} from '../controllers/product.controller';
import { PaginationQuerySchemaDefinition } from '../joi-schema/pagination-query.schema';
import { OrderByQuerySchemaDefinition } from '../joi-schema/order-by-query.schema';
import Joi from 'joi';
import { StoreProductSchema } from '../joi-schema/product/store-product.schema';
import { UpdateProductSchema } from '../joi-schema/product/update-product.schema';
import { ImportProductFromWcSchema } from '../joi-schema/product/import-product-from-wc.schema';

export const getProductRoutes = (): ServerRoute[] => {
  const productRoutes: ServerRoute[] = [
    {
      method: GET_METHOD,
      path: '/products',
      handler: getProducts,
      options: {
        validate: {
          query: Joi.object({
            ...PaginationQuerySchemaDefinition(),
            ...OrderByQuerySchemaDefinition(ORDERABLE_PRODUCT_FIELDS),
          }),
        },
      },
    },
    {
      method: GET_METHOD,
      path: '/products/{productId}',
      handler: getProductDetail,
      options: {
        validate: {
          params: Joi.object({
            productId: Joi.number(),
          }),
        },
      },
    },
    {
      method: POST_METHOD,
      path: '/products',
      handler: storeNewProduct,
      options: {
        validate: {
          payload: StoreProductSchema,
        },
      },
    },
    {
      method: PATCH_METHOD,
      path: '/products/{productId}',
      handler: updateExistingProduct,
      options: {
        validate: {
          params: Joi.object({
            productId: Joi.number(),
          }),
          payload: UpdateProductSchema,
          options: {
            allowUnknown: false,
          },
        },
      },
    },
    {
      method: DELETE_METHOD,
      path: '/products/{productId}',
      handler: deleteExistingProduct,
      options: {
        validate: {
          params: Joi.object({
            productId: Joi.number(),
          }),
        },
      },
    },
    {
      method: POST_METHOD,
      path: '/products/import-wc',
      handler: importProducts,
      options: {
        validate: {
          payload: ImportProductFromWcSchema,
        },
      },
    },
  ];

  return productRoutes;
};
