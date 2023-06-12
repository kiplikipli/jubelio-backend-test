import { ServerRoute } from '@hapi/hapi';
import {
  DELETE_METHOD,
  GET_METHOD,
  ORDERABLE_ADJUSTMENT_TRANSACTION_FIELDS,
  ORDERABLE_PRODUCT_FIELDS,
  PATCH_METHOD,
  POST_METHOD,
} from '../constants';
import { PaginationQuerySchemaDefinition } from '../joi-schema/pagination-query.schema';
import { OrderByQuerySchemaDefinition } from '../joi-schema/order-by-query.schema';
import Joi from 'joi';
import {
  deleteTransaction,
  getTransactionDetail,
  getTransactions,
  storeNewTransaction,
  updateTransaction,
} from '../controllers';
import { StoreAdjustmentTransactionSchema } from '../joi-schema/adjustment-transaction/store-adjustment-transaction.schema';
import { UpdateAdjustmentTransactionSchema } from '../joi-schema/adjustment-transaction/update-adjustment-transaction.schema';

export const getAdjustmentTransactionRoutes = (): ServerRoute[] => {
  const adjustmentTransactionRoutes: ServerRoute[] = [
    {
      method: GET_METHOD,
      path: '/adjustment-transactions',
      handler: getTransactions,
      options: {
        validate: {
          query: Joi.object({
            ...PaginationQuerySchemaDefinition(),
            ...OrderByQuerySchemaDefinition(
              ORDERABLE_ADJUSTMENT_TRANSACTION_FIELDS
            ),
          }),
        },
      },
    },
    {
      method: GET_METHOD,
      path: '/adjustment-transactions/{transactionId}',
      handler: getTransactionDetail,
      options: {
        validate: {
          params: Joi.object({
            transactionId: Joi.number(),
          }),
        },
      },
    },
    {
      method: POST_METHOD,
      path: '/adjustment-transactions',
      handler: storeNewTransaction,
      options: {
        validate: {
          payload: StoreAdjustmentTransactionSchema,
        },
      },
    },
    {
      method: PATCH_METHOD,
      path: '/adjustment-transactions/{transactionId}',
      handler: updateTransaction,
      options: {
        validate: {
          params: Joi.object({
            transactionId: Joi.number(),
          }),
          payload: UpdateAdjustmentTransactionSchema,
        },
      },
    },
    {
      method: DELETE_METHOD,
      path: '/adjustment-transactions/{transactionId}',
      handler: deleteTransaction,
      options: {
        validate: {
          params: Joi.object({
            transactionId: Joi.number(),
          }),
        },
      },
    },
  ];

  return adjustmentTransactionRoutes;
};
