import { EWooCommerceStockStatuses } from '../../enum/woo-commerce/stock-status.enum';

export type TImportProductFromWc = {
  sku?: string[];
  stockStatus?: EWooCommerceStockStatuses;
  count?: number;
};
