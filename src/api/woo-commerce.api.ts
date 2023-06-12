import axios from 'axios';
import { TProductWcQueryParam } from '../types/product/product-wc-query-param.type';
import { TWcProductResponse } from '../types/product/wc-product-response.type';

import dotenv from 'dotenv';

dotenv.config();

const baseUrl = process.env.WOO_COMMERCE_BASE_URL;
const consumerKey = String(process.env.WOO_COMMERCE_CONSUMER_KEY);
const consumerSecret = String(process.env.WOO_COMMERCE_CONSUMER_SECRET);

export const getProductsFromWooCommerce = async (
  params: TProductWcQueryParam
) => {
  const endpoint = `${baseUrl}/wp-json/wc/v3/products`;

  try {
    const response = await axios.get<TWcProductResponse[]>(endpoint, {
      params,
      auth: {
        username: consumerKey,
        password: consumerSecret,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
