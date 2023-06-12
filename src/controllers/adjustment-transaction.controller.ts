import { Request, ResponseToolkit } from '@hapi/hapi';
import { constructPaginationQuery, constructResponse } from '../utils';
import { TOrderBy } from '../types/common/order-by.type';
import {
  deleteAdjustmentTransaction,
  getAdjustmentTransactionDetailById,
  getAdjustmentTransactions,
  storeNewAdjustmentTransaction,
  updateAdjustmentTransaction,
} from '../services/adjustment-transaction.service';
import { errorHandler } from '../utils/error.util';
import { EStatusCode } from '../enum/status-code.enum';
import { TStoreAdjustmentTransaction } from '../types/adjustment-transaction/store-adjustment-transaction.type';
import { TUpdateAdjustmentTransaction } from '../types/adjustment-transaction/update-adjustment-transaction.type';

export const getTransactions = async (req: Request, h: ResponseToolkit) => {
  try {
    const { limit, page, orderByField, orderByMethod } = req.query;
    const paginationQuery = constructPaginationQuery(limit, page);
    const orderBy: TOrderBy = {
      orderByField,
      orderByMethod,
    };

    const products = await getAdjustmentTransactions(paginationQuery, orderBy);
    const { statusCode, ...response } = constructResponse(true, true, products);

    return h.response(response).code(statusCode);
  } catch (error) {
    return errorHandler(error, h);
  }
};

export const getTransactionDetail = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const { transactionId } = req.params;
    const transaction = await getAdjustmentTransactionDetailById(transactionId);
    const { statusCode, ...response } = constructResponse(
      true,
      true,
      transaction
    );

    return h.response(response).code(statusCode);
  } catch (error) {
    return errorHandler(error, h);
  }
};

export const storeNewTransaction = async (req: Request, h: ResponseToolkit) => {
  try {
    const payload = req.payload as Record<string, any>;
    const storeTransactionPayload: TStoreAdjustmentTransaction = {
      productId: payload.productId,
      qty: payload.qty,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newTransaction = await storeNewAdjustmentTransaction(
      storeTransactionPayload
    );

    const { statusCode, ...response } = constructResponse(
      true,
      true,
      newTransaction
    );

    return h.response(response).code(statusCode);
  } catch (error) {
    return errorHandler(error, h);
  }
};

export const updateTransaction = async (req: Request, h: ResponseToolkit) => {
  try {
    const payload = req.payload as Record<string, any>;
    const { transactionId } = req.params;
    const updateTransactionPayload: TUpdateAdjustmentTransaction = {
      transactionId,
      productId: payload.productId,
      qty: payload.qty,
      updatedAt: new Date(),
    };

    const updatedTransaction = await updateAdjustmentTransaction(
      updateTransactionPayload
    );

    const { statusCode, ...response } = constructResponse(
      true,
      true,
      updatedTransaction
    );

    return h.response(response).code(statusCode);
  } catch (error) {
    return errorHandler(error, h);
  }
};

export const deleteTransaction = async (req: Request, h: ResponseToolkit) => {
  try {
    const { transactionId } = req.params;
    const result = await deleteAdjustmentTransaction(transactionId);
    const { statusCode, ...response } = constructResponse(true, true, result);

    return h.response(response).code(EStatusCode.OK);
  } catch (error) {
    return errorHandler(error, h);
  }
};
