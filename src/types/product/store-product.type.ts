import { TProduct } from './product.type';

export type TStoreProduct = Omit<TProduct, 'id'>;
