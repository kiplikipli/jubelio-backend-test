import { EOrderByMethod } from '../../enum/order-by-method.enum';

export type TOrderBy = {
  orderByField: string;
  orderByMethod: EOrderByMethod;
};
