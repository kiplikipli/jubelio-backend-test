import { pgPool } from '../db';
import { TStoreAdjustmentTransaction } from '../types/adjustment-transaction/store-adjustment-transaction.type';
import { TStoreProduct } from '../types/product/store-product.type';
import { storeAdjustmentTransactionToDb } from './adjustment-transaction.repository';
import { storeProductToDb } from './product.repository';

export const storeNewProductWithStockToDb = async (
  productPayload: TStoreProduct
) => {
  const client = await pgPool();
  try {
    await client.query('BEGIN');

    const storedProduct = await storeProductToDb(productPayload, client);

    const transactionPayload: TStoreAdjustmentTransaction = {
      productId: Number(storedProduct.id),
      qty: Number(productPayload.stock),
      amount: Number(productPayload.stock) * productPayload.price,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await storeAdjustmentTransactionToDb(transactionPayload, client);

    await client.query('COMMIT');

    return storedProduct;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
};
