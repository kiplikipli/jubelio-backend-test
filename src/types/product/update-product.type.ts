import { TStoreProduct } from './store-product.type';

export type TUpdateProduct = Omit<TStoreProduct, 'stock'> & {
  productId: number;
};
