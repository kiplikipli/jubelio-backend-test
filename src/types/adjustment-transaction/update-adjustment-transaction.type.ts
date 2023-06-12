import { TStoreAdjustmentTransaction } from './store-adjustment-transaction.type';

export type TUpdateAdjustmentTransaction = Pick<
  TStoreAdjustmentTransaction,
  'productId' | 'qty' | 'updatedAt'
> & {
  transactionId: number;
};
