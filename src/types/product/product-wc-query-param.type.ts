import { EWooCommerceStockStatuses } from '../../enum/woo-commerce/stock-status.enum';

export type TProductWcQueryParam = {
  sku?: string;
  stock_status?: EWooCommerceStockStatuses;
  per_page?: number;
};
