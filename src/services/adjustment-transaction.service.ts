import { TStoreAdjustmentTransaction } from './../types/adjustment-transaction/store-adjustment-transaction.type';
import { NotFoundError } from '../errors/not-found.error';
import {
  deleteAdjustmentTransactionFromDb,
  getAdjustmentTransactionDetailFromDb,
  getAdjustmentTransactionsFromDb,
  getAllAdjustmentTransactionsCountFromDb,
  updateAdjustmentTransactionFromDb,
} from '../repositories/adjustment-transaction.repository';
import { TAdjustmentTransaction } from '../types/adjustment-transaction/adjustment-transaction.type';
import { TOrderBy } from '../types/common/order-by.type';
import { TPaginationQuery } from '../types/common/pagination-query.type';
import { constructPaginatedData } from '../utils';
import { getProductDetailById } from './product.service';
import { storeAdjustmentTransactionToDb } from '../repositories/adjustment-transaction.repository';
import { BadRequestError } from '../errors/bad-request.error';
import { TUpdateAdjustmentTransaction } from '../types/adjustment-transaction/update-adjustment-transaction.type';

export const getAdjustmentTransactions = async (
  pagination: TPaginationQuery,
  orderBy: TOrderBy
) => {
  const [transactions, allTransactionsCount] = await Promise.all([
    getAdjustmentTransactionsFromDb(pagination, orderBy),
    getAllAdjustmentTransactionsCountFromDb(),
  ]);

  const typedTransactions: TAdjustmentTransaction[] = transactions.map(
    (transaction) => ({
      id: transaction.id,
      productId: transaction.product_id,
      sku: transaction.sku,
      qty: transaction.qty,
      amount: transaction.amount,
    })
  );

  const paginatedData = constructPaginatedData(
    typedTransactions,
    allTransactionsCount.count,
    pagination
  );

  return paginatedData;
};

export const getAdjustmentTransactionDetailById = async (
  transactionId: number
): Promise<TAdjustmentTransaction> => {
  const transaction = await getAdjustmentTransactionDetailFromDb(transactionId);
  if (!transaction) {
    throw new NotFoundError('transaction not found');
  }

  const typedTransaction: TAdjustmentTransaction = {
    id: transaction.id,
    productId: transaction.product_id,
    amount: transaction.amount,
    qty: transaction.qty,
    sku: transaction.sku,
  };

  return typedTransaction;
};

export const storeNewAdjustmentTransaction = async (
  payload: TStoreAdjustmentTransaction
) => {
  const product = await getProductDetailById(payload.productId);
  if (
    (product.stock === 0 && payload.qty < 0) ||
    (payload.qty < 0 && Math.abs(payload.qty) > product.stock)
  ) {
    throw new BadRequestError('qty exceeds stock');
  }

  const storePayloadWithAmount: TStoreAdjustmentTransaction = {
    ...payload,
    amount: product.stock * payload.qty,
  };

  const result = await storeAdjustmentTransactionToDb(storePayloadWithAmount);
  const newTransaction = await getAdjustmentTransactionDetailById(result.id);

  return newTransaction;
};

export const updateAdjustmentTransaction = async (
  payload: TUpdateAdjustmentTransaction
) => {
  const product = await getProductDetailById(payload.productId);
  const existingTransaction = await getAdjustmentTransactionDetailById(
    payload.transactionId
  );
  if (
    (product.stock === 0 && payload.qty < 0) ||
    (payload.qty < 0 &&
      Math.abs(payload.qty - existingTransaction.qty) > product.stock)
  ) {
    throw new BadRequestError('qty exceeds stock');
  }

  const result = await updateAdjustmentTransactionFromDb(payload);
  const updatedTransaction = await getAdjustmentTransactionDetailById(
    result.id
  );

  return updatedTransaction;
};

export const deleteAdjustmentTransaction = async (transactionId: number) => {
  await getAdjustmentTransactionDetailById(transactionId);

  const result = await deleteAdjustmentTransactionFromDb(transactionId);

  return result;
};
