import { Pool, PoolClient, QueryResult } from 'pg';
import {
  ADJUSTMENT_TRANSACTIONS_TABLE_NAME,
  PRODUCT_TABLE_NAME,
} from '../constants';
import { pgQuery } from '../db';
import { TStoreAdjustmentTransaction } from '../types/adjustment-transaction/store-adjustment-transaction.type';
import { TOrderBy } from '../types/common/order-by.type';
import { TPaginationQuery } from '../types/common/pagination-query.type';
import { pageToOffset } from '../utils';
import { TUpdateAdjustmentTransaction } from '../types/adjustment-transaction/update-adjustment-transaction.type';

export const getAllAdjustmentTransactionsCountFromDb = async (): Promise<{
  count: number;
}> => {
  const query = `
        SELECT COUNT(*) FROM adjustment_transactions
    `;
  const queryResult = await pgQuery(query);
  const rows = queryResult.rows;
  if (!rows.length) {
    return {
      count: 0,
    };
  }

  return {
    count: Number(rows[0].count),
  };
};

export const getAdjustmentTransactionsFromDb = async (
  pagination: TPaginationQuery,
  orderBy: TOrderBy
): Promise<any[]> => {
  const { limit, offset } = pageToOffset(pagination);
  const queryResult = await pgQuery(
    `
    SELECT  at.id,
            at.product_id,
            p.sku,
            at.qty,
            at.qty * p.price as amount
    FROM ${ADJUSTMENT_TRANSACTIONS_TABLE_NAME} at
    JOIN ${PRODUCT_TABLE_NAME} p on at.product_id = p.id
    ${
      orderBy.orderByField
        ? `ORDER BY ${orderBy.orderByField} ${orderBy.orderByMethod}`
        : ''
    }
    LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  const transactions = queryResult.rows;

  return transactions;
};

export const getAdjustmentTransactionDetailFromDb = async (
  transactionId: number
) => {
  const queryResult = await pgQuery(
    `
    SELECT  at.id,
            at.product_id,
            p.sku,
            at.qty,
            at.qty * p.price as amount
    FROM ${ADJUSTMENT_TRANSACTIONS_TABLE_NAME} at
    JOIN ${PRODUCT_TABLE_NAME} p on at.product_id = p.id
    WHERE at.id = $1`,
    [transactionId]
  );

  if (!queryResult.rowCount) {
    return;
  }

  const transaction = queryResult.rows[0];
  return transaction;
};

export const storeAdjustmentTransactionToDb = async (
  payload: TStoreAdjustmentTransaction,
  client?: Pool | PoolClient
) => {
  let queryResult: QueryResult;
  if (client) {
    queryResult = await client.query(
      `INSERT INTO
      ${ADJUSTMENT_TRANSACTIONS_TABLE_NAME} (product_id, qty, amount, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
      `,
      [
        payload.productId,
        payload.qty,
        payload.amount,
        payload.createdAt,
        payload.updatedAt,
      ]
    );
  } else {
    queryResult = await pgQuery(
      `INSERT INTO
      ${ADJUSTMENT_TRANSACTIONS_TABLE_NAME} (product_id, qty, amount, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
      `,
      [
        payload.productId,
        payload.qty,
        payload.amount,
        payload.createdAt,
        payload.updatedAt,
      ]
    );
  }

  if (!queryResult.rowCount) {
    return;
  }

  const transaction = queryResult.rows[0];
  return transaction;
};

export const updateAdjustmentTransactionFromDb = async (
  payload: TUpdateAdjustmentTransaction
) => {
  let counter = 1;
  const mappedPayload: Record<string, any> =
    mapUpdatePayloadToUpdateableFields(payload);
  const fieldNames = Object.keys(mappedPayload);
  const { transactionId } = payload;

  const queryText = `
    UPDATE ${ADJUSTMENT_TRANSACTIONS_TABLE_NAME}
    SET ${fieldNames.map((fieldName) => {
      return `${fieldName} = $${counter++}`;
    })}
    WHERE id = $${counter}
    RETURNING id
    `;

  console.log(queryText);

  const queryResult = await pgQuery(queryText, [
    ...fieldNames.map((fieldName) => mappedPayload[fieldName]),
    transactionId,
  ]);

  if (!queryResult.rowCount) {
    return;
  }

  const result = queryResult.rows[0];
  return result;
};

export const deleteAdjustmentTransactionFromDb = async (
  transactionId: number
) => {
  const queryResult = await pgQuery(
    `
    DELETE FROM ${ADJUSTMENT_TRANSACTIONS_TABLE_NAME} WHERE id = $1 RETURNING id
    `,
    [transactionId]
  );

  if (!queryResult.rowCount) {
    return;
  }

  const result = queryResult.rows[0];
  return result;
};

const mapUpdatePayloadToUpdateableFields = (
  payload: TUpdateAdjustmentTransaction
) => {
  return {
    product_id: payload.productId,
    qty: payload.qty,
    updated_at: payload.updatedAt,
  };
};
