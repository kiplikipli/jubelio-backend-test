import { Pool, PoolClient, QueryResult } from 'pg';
import {
  ADJUSTMENT_TRANSACTIONS_TABLE_NAME,
  PRODUCT_TABLE_NAME,
} from '../constants';
import { pgQuery } from '../db';
import { TOrderBy } from '../types/common/order-by.type';
import { TPaginationQuery } from '../types/common/pagination-query.type';
import { TStoreProduct } from '../types/product/store-product.type';
import { pageToOffset } from '../utils';
import { TUpdateProduct } from '../types/product/update-product.type';

export const getAllProductsCountFromDb = async (): Promise<{
  count: number;
}> => {
  const query = `
        SELECT COUNT(*) FROM products
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

export const getAllProductsFromDb = async (
  pagination: TPaginationQuery,
  orderBy: TOrderBy
) => {
  const { limit, offset } = pageToOffset(pagination);
  const queryResult = await pgQuery(
    `
    SELECT  p.id,
            p.name,
            p.sku,
            p.image,
            p.price,
            COALESCE(SUM(at.qty), 0) as stock
    FROM ${PRODUCT_TABLE_NAME} p
    LEFT JOIN ${ADJUSTMENT_TRANSACTIONS_TABLE_NAME} at on p.id = at.product_id
    GROUP BY p.id, p.name, p.sku, p.image, p.price
    ${
      orderBy.orderByField
        ? `ORDER BY ${orderBy.orderByField} ${orderBy.orderByMethod}`
        : ''
    }
    LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  const products = queryResult.rows;

  return products;
};

export const getProductsByIdsFromDb = async (productIds: number[]) => {
  const queryText = `
  SELECT  p.id,
            p.name,
            p.sku,
            p.image,
            p.price,
            COALESCE(SUM(at.qty), 0) as stock,
            p.description
    FROM ${PRODUCT_TABLE_NAME} p
    LEFT JOIN ${ADJUSTMENT_TRANSACTIONS_TABLE_NAME} at on p.id = at.product_id
    WHERE p.id = ANY($1::int[])
    GROUP BY p.id, p.name, p.sku, p.image, p.price
  `;

  const queryResult = await pgQuery(queryText, [productIds]);

  return queryResult.rows;
};

export const getProductDetailByIdFromDb = async (productId: number) => {
  const queryResult = await pgQuery(
    `
    SELECT  p.id,
            p.name,
            p.sku,
            p.image,
            p.price,
            COALESCE(SUM(at.qty), 0) as stock,
            p.description
    FROM ${PRODUCT_TABLE_NAME} p
    LEFT JOIN ${ADJUSTMENT_TRANSACTIONS_TABLE_NAME} at on p.id = at.product_id
    WHERE p.id = $1
    GROUP BY p.id, p.name, p.sku, p.image, p.price
    `,
    [productId]
  );

  if (!queryResult.rowCount) {
    return;
  }

  const product = queryResult.rows[0];
  return product;
};

export const getProductDetailBySkuFromDb = async (sku: string) => {
  const queryResult = await pgQuery(
    `
    SELECT  p.id,
            p.name,
            p.sku,
            p.image,
            p.price,
            COALESCE(SUM(at.qty), 0) as stock,
            p.description
    FROM ${PRODUCT_TABLE_NAME} p
    LEFT JOIN ${ADJUSTMENT_TRANSACTIONS_TABLE_NAME} at on p.id = at.product_id
    WHERE p.sku = $1
    GROUP BY p.id, p.name, p.sku, p.image, p.price
    `,
    [sku]
  );

  if (!queryResult.rowCount) {
    return;
  }

  const product = queryResult.rows[0];
  return product;
};

export const storeProductToDb = async (
  payload: TStoreProduct,
  client?: Pool | PoolClient
) => {
  let queryResult: QueryResult;
  if (client) {
    queryResult = await client.query(
      `INSERT INTO
      products (sku, name, price, image, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
      `,
      [
        payload.sku,
        payload.name,
        payload.price,
        payload.image,
        payload.description,
      ]
    );
  } else {
    queryResult = await pgQuery(
      `INSERT INTO
      products (sku, name, price, image, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
      `,
      [
        payload.sku,
        payload.name,
        payload.price,
        payload.image,
        payload.description,
      ]
    );
  }

  if (!queryResult.rowCount) {
    return;
  }

  const product = queryResult.rows[0];
  return product;
};

export const updateProductFromDb = async (payload: TUpdateProduct) => {
  let counter = 1;
  const mappedPayload: Record<string, any> =
    mapUpdatePayloadToUpdateableFields(payload);

  const fieldNames = Object.keys(mappedPayload);
  const { productId } = payload;

  const queryText = `
    UPDATE ${PRODUCT_TABLE_NAME}
    SET ${fieldNames.map((fieldName) => {
      return `${fieldName} = $${counter++}`;
    })}
    WHERE id = $${counter}
    RETURNING id
    `;
  const queryResult = await pgQuery(queryText, [
    ...fieldNames.map((fieldName) => mappedPayload[fieldName]),
    productId,
  ]);

  if (!queryResult.rowCount) {
    return;
  }

  const result = queryResult.rows[0];
  return result;
};

export const deleteProductByIdFromDb = async (productId: number) => {
  const queryResult = await pgQuery(
    `
    DELETE FROM ${PRODUCT_TABLE_NAME} WHERE id = $1 RETURNING id
    `,
    [productId]
  );

  if (!queryResult.rowCount) {
    return;
  }

  const result = queryResult.rows[0];
  return result;
};

const mapUpdatePayloadToUpdateableFields = (payload: TUpdateProduct) => {
  return {
    sku: payload.sku,
    name: payload.name,
    image: payload.image,
    price: payload.price,
    description: payload.description,
  };
};
